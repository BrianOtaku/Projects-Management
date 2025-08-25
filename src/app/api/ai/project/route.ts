import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, normalizeData, normalizeDeadline, setStatus } from "@/lib/utils";

const genai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'MANAGER') {
        return NextResponse.json({ message: 'Only manager can create project' }, { status: 403 });
    }

    try {
        const now = new Date();
        const body = await req.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json(
                { message: "Thiếu message để tạo project" },
                { status: 400 }
            );
        }

        const teams = await prisma.team.findMany({
            select: {
                id: true,
                teamName: true,
            },
        });
        const teamList = teams.map(team => `ID: ${team.id}, Name: ${team.teamName}`).join("\n");

        const prompt = `
        You are an intelligent project management assistant. Analyze the following user message and extract the necessary information to create a new project:
        Message: "${message}"

        List of available teams:
        ${teamList || "No teams available."}

        Requirements:
        - Extract title (project name, if missing then use "New Project").
        - Extract description (project description, if missing then use "No description").
        - Extract startDate (start date, in ISO 8601 format like "2025-08-25T00:00:00.000Z", if missing then use the current date: ${now}).
        - Extract dueDate (end date, in ISO 8601 format like "2025-08-25T00:00:00.000Z", if missing then use 30 days after startDate, always set the time to 00:00:00.000Z).

        Return ONLY valid JSON, without any additional characters (no markdown, no explanations):
        {
            "title": "project name",
            "description": "description",
            "startDate": "2025-08-25T00:00:00.000Z",
            "dueDate": "2025-09-25T00:00:00.000Z",
            "teamId": number or null
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

        let projectData;
        try {
            projectData = JSON.parse(cleanedResponse);
        } catch (e) {
            console.error("Lỗi parse JSON từ Gemini:", e);
            return NextResponse.json(
                { message: "Gemini trả về JSON không hợp lệ", raw: response.text, cleaned: cleanedResponse },
                { status: 500 }
            );
        }

        if (isNaN(Date.parse(projectData.startDate)) || isNaN(Date.parse(projectData.dueDate))) {
            return NextResponse.json(
                { message: "Ngày không hợp lệ từ Gemini" },
                { status: 400 }
            );
        }

        const status = setStatus({
            startDate: new Date(projectData.startDate),
            dueDate: normalizeDeadline(new Date(projectData.dueDate)),
            canceled: false,
            submit: false,
            accept: false,
            completedAt: null
        });

        const formattedData = {
            title: projectData.title,
            description: projectData.description,
            startDate: new Date(projectData.startDate),
            dueDate: normalizeDeadline(new Date(projectData.dueDate)),
            status,
            teamId: projectData.teamId || null,
        };

        const project = await prisma.project.create({ data: formattedData });

        return NextResponse.json(normalizeData(project), { status: 201 });
    } catch (error) {
        console.error("Lỗi server:", error);
        return NextResponse.json(
            { message: "Lỗi server", error },
            { status: 500 }
        );
    }
}