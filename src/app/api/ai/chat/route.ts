import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, normalizeData } from "@/lib/utils";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const conversation = await prisma.message.findMany({
            where: { userId: BigInt(user.id) }
        });

        return NextResponse.json(normalizeData(conversation), { status: 200 })
    } catch (error) {
        console.error('[GET /api/chat]', error)
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        const userMessage = await prisma.message.create({
            data: {
                userId: user.id,
                content: message,
                role: "MANAGER",
            },
        });

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: message,
        });

        const reply = response.text || "No response";
        const aiMessage = await prisma.message.create({
            data: {
                userId: user.id,
                content: reply,
                role: "AI",
            },
        });

        return NextResponse.json({
            userMessage: normalizeData(userMessage),
            aiMessage: normalizeData(aiMessage),
        });
    } catch (error) {
        console.error("Gemini API error:", error);
        return NextResponse.json(
            { error: "Failed to process chat" },
            { status: 500 }
        );
    }
}
