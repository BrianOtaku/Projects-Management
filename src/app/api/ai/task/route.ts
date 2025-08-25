import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, normalizeData, normalizeDeadline, setStatus } from "@/lib/utils";

const genai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'Thiếu id' }, { status: 400 });
    }

    if (!user || user.role !== 'LEADER') {
        return NextResponse.json({ message: 'Only leader can create task' }, { status: 403 });
    }

    try {
        const now = new Date();
        const body = await req.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json(
                { message: "Thiếu message để tạo task" },
                { status: 400 }
            );
        }

        const project = await prisma.project.findUnique({
            where: { id: BigInt(id) },
            include: {
                team: {
                    include: {
                        members: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!project || !project.teamId || !project.team) {
            return NextResponse.json(
                { message: "Project không tồn tại hoặc không có team liên kết" },
                { status: 400 }
            );
        }
        const membersList = project.team.members
            .map(member => `ID: ${member.id}, Name: ${member.name}`)
            .join("\n");

        const prompt = `
        You are an intelligent project management assistant. Analyze the following user message and extract the necessary information to create a new task:
        Message: "${message}"

        List of available staff (choose any user from the list below):
        ${membersList}

        Requirements:
        - Extract title (task name, if missing then use "New Task").
        - Extract description (task description, if missing then use "No description").
        - Extract startDate (start date, in ISO 8601 format like "2025-08-25T00:00:00.000Z", if missing then use the current date: ${now}).
        - Extract dueDate (end date, in ISO 8601 format like "2025-08-25T00:00:00.000Z", if missing then use 30 days after startDate, always set the time to 00:00:00.000Z).

        Return ONLY valid JSON, without any additional characters (no markdown, no explanations):
        {
            "title": "task name",
            "description": "description",
            "startDate": "2025-08-25T00:00:00.000Z",
            "dueDate": "2025-09-25T00:00:00.000Z",
            "userId": number
        }
        `;

        const response = await genai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        if (!response.text) {
            return NextResponse.json(
                { message: "Không nhận được dữ liệu từ Gemini" },
                { status: 500 }
            );
        }

        let cleanedResponse = response.text.trim();
        cleanedResponse = cleanedResponse.replace(/^```json\n|\n```$/g, '');

        let taskData;
        try {
            taskData = JSON.parse(cleanedResponse);
        } catch (e) {
            console.error("Lỗi parse JSON từ Gemini:", e);
            return NextResponse.json(
                { message: "Gemini trả về JSON không hợp lệ", raw: response.text, cleaned: cleanedResponse },
                { status: 500 }
            );
        }

        if (isNaN(Date.parse(taskData.startDate)) || isNaN(Date.parse(taskData.dueDate))) {
            return NextResponse.json(
                { message: "Ngày không hợp lệ từ Gemini" },
                { status: 400 }
            );
        }

        const status = setStatus({
            startDate: new Date(taskData.startDate),
            dueDate: normalizeDeadline(new Date(taskData.dueDate)),
            canceled: false,
            submit: false,
            accept: false,
            completedAt: null
        });

        const formattedData = {
            title: taskData.title,
            description: taskData.description,
            startDate: new Date(taskData.startDate),
            dueDate: normalizeDeadline(new Date(taskData.dueDate)),
            status,
            userId: taskData.userId,
            projectId: BigInt(id),
        };

        const task = await prisma.task.create({ data: formattedData });

        return NextResponse.json(normalizeData(task), { status: 201 });
    } catch (error) {
        console.error("Lỗi server:", error);
        return NextResponse.json(
            { message: "Lỗi server", error },
            { status: 500 }
        );
    }
}