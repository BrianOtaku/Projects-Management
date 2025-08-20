import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeData, getCurrentUser } from '@/lib/utils';

export async function GET() {
    const tasks = await prisma.task.findMany({
        include: {
            project: {
                include: {
                    team: {
                        include: {
                            leader: true,
                        },
                    },
                },
            },
            user: true,
        },
    });
    return NextResponse.json(normalizeData(tasks));
}

export async function POST(req: Request) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'LEADER') {
        return NextResponse.json({ message: 'Only leader can create tasks' }, { status: 403 });
    }

    const data = await req.json();

    const assignedUser = await prisma.user.findUnique({
        where: { id: Number(data.userId) },
    });

    if (!assignedUser) {
        return NextResponse.json({ message: 'Assigned user not found' }, { status: 404 });
    }

    if (assignedUser.role !== 'STAFF') {
        return NextResponse.json({ message: 'Assigned user must have STAFF role' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
        where: { id: Number(data.projectId) },
        include: {
            team: true,
        },
    });

    if (!project) {
        return NextResponse.json(
            { message: "Project not found" },
            { status: 404 }
        );
    }

    if (project.team?.leaderId?.toString() !== user.id.toString()) {
        return NextResponse.json(
            { message: "You are not the leader of this project" },
            { status: 403 }
        );
    }

    const newTask = await prisma.task.create({
        data: {
            title: data.title,
            description: data.description,
            status: data.status,
            startDate: new Date(data.startDate),
            dueDate: new Date(data.dueDate),
            userId: Number(data.userId),
            projectId: Number(data.projectId),
        },
    });

    return NextResponse.json(normalizeData(newTask), { status: 201 });
}

export async function PUT(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !['LEADER', 'STAFF'].includes(user.role)) {
            return NextResponse.json({ message: 'Không có quyền' }, { status: 403 });
        }

        const id = req.nextUrl.searchParams.get('id')

        if (!id) {
            return NextResponse.json({ message: 'Thiếu id' }, { status: 400 });
        }

        const body = await req.json();

        // Chuẩn bị data cập nhật
        let updateData = {};

        if (user.role === 'LEADER') {
            updateData = {
                title: body.title,
                description: body.description,
                status: body.status,
                userId: body.userId ? Number(body.userId) : undefined,
                startDate: body.startDate ? new Date(body.startDate) : undefined,
                dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
            };
        } else if (user.role === 'STAFF') {
            updateData = { status: "COMPLETED" };
        }

        const updatedTask = await prisma.task.update({
            where: { id: Number(id) },
            data: updateData
        });

        return NextResponse.json({
            message: 'Cập nhật thành công',
            task: normalizeData(updatedTask)
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
    }
}

// DELETE: chỉ leader được phép
export async function DELETE(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'LEADER') {
            return NextResponse.json({ message: 'Không có quyền' }, { status: 403 });
        }

        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Thiếu id' }, { status: 400 });
        }

        await prisma.task.delete({
            where: { id: Number(id) }
        });

        return NextResponse.json({ message: 'Xóa thành công' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
    }
}
