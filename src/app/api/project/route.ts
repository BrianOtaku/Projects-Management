import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { convertBigIntToString } from '@/lib/utils'
import { getCurrentUser } from '@/lib/utils'

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                teamMembers: true,
            },
        })
        return NextResponse.json(convertBigIntToString(projects), { status: 200 })
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
        const body = await req.json()
        const {
            title,
            description,
            status,
            startDate,
            dueDate,
            progress,
            fileUrl,
        } = body

        if (!title || !description || !status || !startDate || !dueDate) {
            return NextResponse.json(
                { error: 'Thiếu thông tin bắt buộc' },
                { status: 400 }
            )
        }

        const newProject = await prisma.project.create({
            data: {
                title,
                description,
                status,
                startDate: new Date(startDate),
                dueDate: new Date(dueDate),
                progress: progress ?? 0.0,
                fileUrl,
            },
        })

        return NextResponse.json(convertBigIntToString(newProject), { status: 201 })
    } catch (error) {
        console.error('[POST /api/project]', error)
        return NextResponse.json({ error: 'Lỗi khi tạo project' }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'MANAGER') {
        return NextResponse.json({ message: 'Only manager can update project' }, { status: 403 });
    }

    try {
        const body = await req.json()
        const {
            id,
            title,
            description,
            status,
            startDate,
            dueDate,
            progress,
            fileUrl,
        } = body

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })
        }

        const updated = await prisma.project.update({
            where: { id: BigInt(id) },
            data: {
                title,
                description,
                status,
                startDate: startDate ? new Date(startDate) : undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                progress,
                fileUrl,
            },
        })

        return NextResponse.json(convertBigIntToString(updated), { status: 200 })
    } catch (error) {
        console.error('[PUT /api/project]', error)
        return NextResponse.json({ error: 'Lỗi khi cập nhật' }, { status: 500 })
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
