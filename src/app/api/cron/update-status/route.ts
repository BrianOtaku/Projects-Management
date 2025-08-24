import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const now = new Date();

    const updatedProjects = await prisma.project.updateMany({
        where: { status: "NOT_STARTED", startDate: { lte: now } },
        data: { status: "IN_PROGRESS" },
    });

    const updatedTasks = await prisma.task.updateMany({
        where: { status: "NOT_STARTED", startDate: { lte: now } },
        data: { status: "IN_PROGRESS" },
    });

    return NextResponse.json({
        message: "Cron job executed",
        updatedProjects: updatedProjects.count,
        updatedTasks: updatedTasks.count,
    });
}
