import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeData, getCurrentUser, setStatus, normalizeDeadline } from '@/lib/utils';

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

    const now = new Date();
    const startDate = new Date(data.startDate);
    const dueDate = new Date(data.dueDate);
    if (now < project.startDate) {
        return NextResponse.json({ message: "Project is not started" }, { status: 400 })
    }

    if (startDate > normalizeDeadline(dueDate) || normalizeDeadline(dueDate) < now) {
        return NextResponse.json({ error: 'You fucking idiot!' }, { status: 400 });
    }

    if (project.team?.leaderId?.toString() !== user.id.toString()) {
        return NextResponse.json({ message: "You are not the leader of this project" }, { status: 403 });
    }

    const status = setStatus({
        startDate: new Date(data.startDate),
        dueDate: normalizeDeadline(new Date(data.dueDate)),
        canceled: false,
        submit: false,
        accept: false,
        completedAt: null
    });

    const newTask = await prisma.task.create({
        data: {
            title: data.title,
            description: data.description,
            status,
            startDate: new Date(data.startDate),
            dueDate: normalizeDeadline(new Date(data.dueDate)),
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

        const id = req.nextUrl.searchParams.get('id');

        const currentTask = await prisma.task.findUnique({ where: { id: Number(id) }, });
        if (!currentTask) {
            return NextResponse.json({ message: "Task không tồn tại" }, { status: 404 });
        }
        if (currentTask.status === "OVERDUE" || currentTask.status === "COMPLETED" || currentTask.status === "CANCELED") {
            return NextResponse.json({ message: "Task đã hoàn thành hoặc bị hủy" }, { status: 400 });
        }

        if (!id) {
            return NextResponse.json({ message: 'Thiếu id' }, { status: 400 });
        }

        const body = await req.json()
        const {
            title,
            description,
            userId,
        } = body

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })
        }

        const now = new Date();
        const startDate = new Date(body.startDate);
        const dueDate = new Date(body.dueDate);
        if (startDate > normalizeDeadline(dueDate) || normalizeDeadline(dueDate) < now) {
            return NextResponse.json(
                { error: 'You fucking idiot!' },
                { status: 400 }
            );
        }

        const status = setStatus({
            startDate: new Date(startDate),
            dueDate: normalizeDeadline(new Date(dueDate)),
            canceled: currentTask.canceled,
            submit: currentTask.submit,
            accept: currentTask.accept,
            completedAt: null
        });

        const updated = await prisma.task.update({
            where: { id: BigInt(id) },
            data: {
                title: title,
                description: description,
                status,
                startDate: startDate ? new Date(startDate) : undefined,
                dueDate: dueDate ? normalizeDeadline(new Date(dueDate)) : undefined,
                userId: userId ? BigInt(userId) : undefined,
            },
        })

        return NextResponse.json(normalizeData(updated), { status: 200 })
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !['LEADER', 'STAFF'].includes(user.role)) {
            return NextResponse.json({ message: 'Không có quyền' }, { status: 403 });
        }

        const id = req.nextUrl.searchParams.get('id');

        const currentTask = await prisma.task.findUnique({ where: { id: Number(id) }, });
        if (!currentTask) {
            return NextResponse.json({ message: "Task không tồn tại" }, { status: 404 });
        }

        if (!id) {
            return NextResponse.json({ message: 'Thiếu id' }, { status: 400 });
        }

        const body = await req.json();
        const now = new Date();
        if (now < currentTask.startDate) {
            return NextResponse.json({ message: "Task is not started" }, { status: 400 })
        }

        let updateData = {};

        if (user.role === "STAFF") {
            if (body.submit !== true) {
                return NextResponse.json(
                    { message: "Staff chỉ có thể submit task" },
                    { status: 403 }
                );
            }

            if (!currentTask.status) {
                return NextResponse.json(
                    { message: "Chỉ có thể submit khi task đang IN_PROGRESS" },
                    { status: 403 }
                );
            }

            if (currentTask.submit === true) {
                return NextResponse.json(
                    { message: "Task đã được submit, không thể submit lại" },
                    { status: 403 }
                );
            }

            updateData = { submit: true, status: "PENDING" };
        }

        if (user.role === "LEADER") {
            const now = new Date();

            if (body.accept === true && now > currentTask.dueDate) {
                updateData = { accept: true, completeAt: now, status: "OVERDUE" };
            } else if (body.accept === true) {
                updateData = { accept: true, completeAt: now, status: "COMPLETED" };
            }

            if (body.accept === false) {
                updateData = { submit: false, accept: false, status: "IN_PROGRESS" };
            }

            if (body.canceled === true) {
                updateData = { canceled: true, status: "CANCELED" };
            }
        }

        const updatedTask = await prisma.task.update({
            where: { id: Number(id) },
            data: updateData,
        });

        return NextResponse.json({ message: "Cập nhật status thành công", task: normalizeData(updatedTask), });

    } catch (err) {
        console.error(err); return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
    }
}

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
