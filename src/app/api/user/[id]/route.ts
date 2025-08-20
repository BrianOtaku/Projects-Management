import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeData } from '@/lib/utils'

export async function GET(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ message: "Thiếu id user" }, { status: 400 });
        }
        const users = await prisma.user.findUnique({
            where: { id: BigInt(id) },
            include: {
                tasks: true,
                team: true,
                leader: true
            },
        })
        return NextResponse.json(normalizeData(users), { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Lỗi khi lấy users', error }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");
        const body = await req.json()
        const { name, email, password } = body

        if (!id) {
            return NextResponse.json({ message: 'Thiếu id người dùng' }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: BigInt(id) },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(password && { password })
            },
        })

        return NextResponse.json(normalizeData(updatedUser), { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Lỗi khi cập nhật user', error }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
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

        const res = NextResponse.json({ message: 'Xóa thành công' });
        res.cookies.set('token', '', { httpOnly: true, expires: new Date(0) });
        return res;

    } catch (error) {
        console.error('[DELETE /api/project]', error)
        return NextResponse.json({ error: 'Lỗi khi xoá project' }, { status: 500 })
    }
}

