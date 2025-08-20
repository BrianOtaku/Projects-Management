import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeData } from '@/lib/utils'
import bcrypt from 'bcrypt'
import { getCurrentUser } from '@/lib/utils'


export async function GET() {
    try {
        const users = await prisma.user.findMany({
            include: {
                tasks: true,
                team: true,
                leader: true,
            },
        })
        return NextResponse.json(normalizeData(users), { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Lỗi khi lấy users', error }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const user = await getCurrentUser()

    if (!user || user.role !== 'MANAGER') {
        return NextResponse.json({ message: 'Only manager can create a user' }, { status: 403 })
    }

    try {
        const body = await req.json()
        const { name, email, password, role } = body

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        })

        return NextResponse.json(normalizeData(newUser), { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const user = await getCurrentUser()

    if (!user || user.role !== 'MANAGER') {
        return NextResponse.json({ message: 'Only manager can update a user' }, { status: 403 })
    }

    try {
        const id = req.nextUrl.searchParams.get("id");
        const body = await req.json()
        const { role, teamId } = body

        if (!id) {
            return NextResponse.json({ message: 'Thiếu id người dùng' }, { status: 400 })
        }

        // 🔎 Lấy user trước để check
        const existingUser = await prisma.user.findUnique({
            where: { id: BigInt(id) },
            include: { leader: true }, // check quan hệ leader
        })

        if (!existingUser) {
            return NextResponse.json({ message: 'Không tìm thấy user' }, { status: 404 })
        }

        // ❌ Nếu user đang là leader của ít nhất 1 team → không cho đổi role
        if (existingUser.leader.length > 0 && role && role !== existingUser.role) {
            return NextResponse.json({ message: 'Không thể đổi role vì user đang là leader của một team' }, { status: 400 })
        }

        // ✅ Update
        const updatedUser = await prisma.user.update({
            where: { id: BigInt(id) },
            data: {
                ...(role && { role }),
                ...(teamId && { teamId }),
            },
        })

        return NextResponse.json(normalizeData(updatedUser), { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Lỗi khi cập nhật user', error }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const user = await getCurrentUser()

    if (!user || user.role !== 'MANAGER') {
        return NextResponse.json({ message: 'Only manager can delete a user' }, { status: 403 })
    }

    try {
        const id = req.nextUrl.searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { id: BigInt(id) },
            include: { leader: true }, // check quan hệ leader
        })

        if (!existingUser) {
            return NextResponse.json({ message: 'Không tìm thấy user' }, { status: 404 })
        }

        if (existingUser.leader.length > 0) {
            return NextResponse.json(
                { message: 'Không thể xóa vì user đang là leader của một team' },
                { status: 400 }
            );
        }

        await prisma.user.delete({
            where: { id: BigInt(id) },
        })

        return NextResponse.json({ message: 'Xoá thành công' })
    } catch (error) {
        console.error('[DELETE /api/project]', error)
        return NextResponse.json({ error: 'Lỗi khi xoá project' }, { status: 500 })
    }
}

