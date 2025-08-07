import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/app/api/auth/getCurrentUser';

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const task = await prisma.task.findUnique({
        where: { id: BigInt(params.id) },
    });

    if (!task) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    const taskId = BigInt(params.id);
    const data = await req.json();

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    if (!user) {
        return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
    }

    if (user.role === 'STAFF') {
        // Chỉ được cập nhật tiến độ, completeAt
        const updated = await prisma.task.update({
            where: { id: taskId },
            data: {
                status: data.status,
                completeAt: data.completeAt ? new Date(data.completeAt) : undefined,
            },
        });
        return NextResponse.json(updated);
    }

    if (user.role === 'LEADER') {
        // Leader được sửa mọi thứ
        const updated = await prisma.task.update({
            where: { id: taskId },
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                startDate: new Date(data.startDate),
                dueDate: new Date(data.dueDate),
                userId: BigInt(data.userId),
                reviewedByLeader: data.reviewedByLeader,
                completeAt: data.completeAt ? new Date(data.completeAt) : undefined,
            },
        });
        return NextResponse.json(updated);
    }

    return NextResponse.json({ message: 'Access denied' }, { status: 403 });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'LEADER') {
        return NextResponse.json({ message: 'Only leader can delete tasks' }, { status: 403 });
    }

    await prisma.task.delete({
        where: { id: BigInt(params.id) },
    });

    return NextResponse.json({ message: 'Task deleted' });
}
