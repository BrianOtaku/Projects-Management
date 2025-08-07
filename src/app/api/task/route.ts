import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/app/api/auth/getCurrentUser';

export async function GET() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'LEADER') {
        return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks);
}

export async function POST(req: Request) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'LEADER') {
        return NextResponse.json({ message: 'Only leader can create tasks' }, { status: 403 });
    }

    const data = await req.json();

    const newTask = await prisma.task.create({
        data: {
            title: data.title,
            description: data.description,
            status: data.status,
            startDate: new Date(data.startDate),
            dueDate: new Date(data.dueDate),
            userId: BigInt(data.userId),
            projectId: BigInt(data.projectId),
        },
    });

    return NextResponse.json(newTask, { status: 201 });
}
