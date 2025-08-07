import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { convertBigIntToString } from '@/lib/utils'

export async function GET() {
    try {
        const teamMembers = await prisma.teamMember.findMany({
            include: {
                user: true,
                project: true,
            },
        })
        return NextResponse.json(convertBigIntToString(teamMembers), { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Lỗi khi lấy team members', error }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { userId, projectId } = body

        if (!userId || !projectId) {
            return NextResponse.json({ message: 'Thiếu userId hoặc projectId' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { id: BigInt(userId) },
        })

        if (!user) {
            return NextResponse.json({ message: 'User không tồn tại' }, { status: 404 })
        }

        if (user.role === 'MANAGER') {
            return NextResponse.json({ message: 'Manager không được tham gia team (project)' }, { status: 403 })
        }

        const existing = await prisma.teamMember.findFirst({
            where: { userId: BigInt(userId) },
        })

        if (existing) {
            return NextResponse.json({ message: 'User đã thuộc một team khác' }, { status: 400 })
        }

        const newTeamMember = await prisma.teamMember.create({
            data: {
                userId: BigInt(userId),
                projectId: BigInt(projectId),
            },
        })

        return NextResponse.json(convertBigIntToString(newTeamMember), { status: 201 })

    } catch (error: unknown) {
        if (error === 'P2002') {
            return NextResponse.json({ message: 'User này đã thuộc một team khác' }, { status: 400 })
        }

        return NextResponse.json({ message: 'Lỗi khi tạo team member', error }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, userId, projectId } = body

        if (!id || !userId || !projectId) {
            return NextResponse.json({ message: 'Thiếu id team member' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { id: BigInt(userId) },
        })

        if (!user) {
            return NextResponse.json({ message: 'User không tồn tại' }, { status: 404 })
        }

        if (user.role === 'MANAGER') {
            return NextResponse.json({ message: 'Manager không được tham gia team (project)' }, { status: 403 })
        }

        const existing = await prisma.teamMember.findFirst({
            where: { userId: BigInt(userId) },
        })

        if (existing) {
            return NextResponse.json({ message: 'User đã thuộc một team khác' }, { status: 400 })
        }

        const updatedTeamMember = await prisma.teamMember.update({
            where: { id: BigInt(id) },
            data: {
                ...(userId && { userId: BigInt(userId) }),
                ...(projectId && { projectId: BigInt(projectId) }),
            },
        })

        return NextResponse.json(convertBigIntToString(updatedTeamMember), { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Lỗi khi cập nhật team member', error }, { status: 500 })
    }
}
