import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { setStatus, normalizeData, normalizeDeadline } from '@/lib/utils'
import { getCurrentUser } from '@/lib/utils'

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                team: {
                    include: {
                        members: true,
                        leader: true,
                    },
                },
                tasks: true,
            },
        })

        return NextResponse.json(normalizeData(projects), { status: 200 })
    } catch (error) {
        console.error('[GET /api/project]', error)
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'MANAGER') {
        return NextResponse.json({ message: 'Only manager can create project' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const {
            title,
            description,
            teamId,
        } = body;

        const now = new Date()
        const startDate = new Date(body.startDate);
        const dueDate = new Date(body.dueDate);
        if (startDate > normalizeDeadline(dueDate) || normalizeDeadline(dueDate) < now) {
            return NextResponse.json(
                { error: 'You fucking idiot!' },
                { status: 400 }
            );
        }

        if (!title || !description || !startDate || !dueDate) {
            return NextResponse.json(
                { error: 'Thiếu thông tin bắt buộc' },
                { status: 400 }
            );
        }

        const status = setStatus({
            startDate: new Date(body.startDate),
            dueDate: normalizeDeadline(new Date(body.dueDate)),
            canceled: false,
            submit: false,
            accept: false,
            completedAt: null
        });

        const newProject = await prisma.project.create({
            data: {
                title,
                description,
                status,
                startDate: new Date(startDate),
                dueDate: normalizeDeadline(new Date(dueDate)),
                teamId,
            },
        })

        return NextResponse.json(normalizeData(newProject), { status: 201 })
    } catch (error) {
        console.error('[POST /api/project]', error)
        return NextResponse.json({ error: 'Lỗi khi tạo project' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'MANAGER') {
        return NextResponse.json({ message: 'Only manager can update project' }, { status: 403 });
    }

    try {
        const id = req.nextUrl.searchParams.get('id')

        if (!id) {
            return NextResponse.json({ message: 'Missing teamId in query' }, { status: 400 });
        }

        const currentProject = await prisma.project.findUnique({ where: { id: Number(id) }, });
        if (!currentProject) {
            return NextResponse.json({ message: "Project không tồn tại" }, { status: 404 });
        }
        if (currentProject.status === "OVERDUE" || currentProject.status === "COMPLETED" || currentProject.status === "CANCELED") {
            return NextResponse.json({ message: "Project đã hoàn thành hoặc bị hủy" }, { status: 400 });
        }

        const body = await req.json()
        const {
            title,
            description,
            teamId,
        } = body

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })
        }

        const now = new Date()
        const startDate = new Date(body.startDate);
        const dueDate = new Date(body.dueDate);
        if (startDate > normalizeDeadline(dueDate) || normalizeDeadline(dueDate) < now) {
            return NextResponse.json(
                { error: 'You fucking idiot!' },
                { status: 400 }
            );
        }

        const status = setStatus({
            startDate: new Date(currentProject.startDate),
            dueDate: normalizeDeadline(new Date(currentProject.dueDate)),
            canceled: currentProject.canceled,
            submit: currentProject.submit,
            accept: currentProject.accept,
        });

        const updated = await prisma.project.update({
            where: { id: BigInt(id) },
            data: {
                title,
                description,
                status,
                startDate: startDate ? new Date(startDate) : undefined,
                dueDate: dueDate ? normalizeDeadline(new Date(dueDate)) : undefined,
                teamId: teamId ? BigInt(teamId) : undefined,
            },
        })

        return NextResponse.json(normalizeData(updated), { status: 200 })
    } catch (error) {
        console.error('[PUT /api/project]', error)
        return NextResponse.json({ error: 'Lỗi khi cập nhật' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        console.log("current user:", user);
        if (!user || !['LEADER', 'MANAGER'].includes(user.role)) {
            return NextResponse.json({ message: 'Không có quyền' }, { status: 403 });
        }

        const id = req.nextUrl.searchParams.get('id');

        const currentProject = await prisma.project.findUnique({ where: { id: Number(id) }, });
        if (!currentProject) {
            return NextResponse.json({ message: "Project không tồn tại" }, { status: 404 });
        }
        if (currentProject.status === "OVERDUE" || currentProject.status === "COMPLETED" || currentProject.status === "CANCELED") {
            return NextResponse.json({ message: "Project đã hoàn thành hoặc bị hủy" }, { status: 400 });
        }

        if (!id) {
            return NextResponse.json({ message: 'Thiếu id' }, { status: 400 });
        }

        const body = await req.json();

        let updateData = {};

        if (user.role === "LEADER") {
            if (body.submit !== true) {
                return NextResponse.json(
                    { message: "Leader chỉ có thể submit" },
                    { status: 403 }
                );
            }

            if (!(currentProject.status === "IN_PROGRESS")) {
                return NextResponse.json(
                    { message: "Chỉ có thể submit khi project đang IN_PROGRESS" },
                    { status: 403 }
                );
            }

            if (currentProject.submit === true) {
                return NextResponse.json(
                    { message: "Project đã được submit, không thể submit lại" },
                    { status: 403 }
                );
            }

            updateData = { submit: true, status: "PENDING" };
        }

        if (user.role === "MANAGER") {
            const now = new Date();

            if (body.accept === true && now > currentProject.dueDate) {
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

        const updatedProject = await prisma.project.update({
            where: { id: Number(id) },
            data: updateData,
        });

        return NextResponse.json({ message: "Cập nhật status thành công", task: normalizeData(updatedProject), });

    } catch (err) {
        console.error(err); return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'MANAGER') {
        return NextResponse.json({ message: 'Only manager can delete project' }, { status: 403 });
    }

    try {
        const id = req.nextUrl.searchParams.get('id')
        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })
        }

        await prisma.project.delete({
            where: { id: BigInt(id) },
        })

        return NextResponse.json({ message: 'Xoá thành công' })
    } catch (error) {
        console.error('[DELETE /api/project]', error)
        return NextResponse.json({ error: 'Lỗi khi xoá project' }, { status: 500 })
    }
}
