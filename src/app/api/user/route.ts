import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { convertBigIntToString } from '@/lib/utils'
import bcrypt from 'bcrypt'

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            include: {
                tasks: true,
                teamMember: true,
            },
        })
        return NextResponse.json(convertBigIntToString(users), { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Lỗi khi lấy users', error }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, email, password, role } = body

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        })

        return NextResponse.json(convertBigIntToString(newUser), { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, name, email, role } = body

        if (!id) {
            return NextResponse.json({ message: 'Thiếu id người dùng' }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: BigInt(id) },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(role && { role }),
            },
        })

        return NextResponse.json(convertBigIntToString(updatedUser), { status: 200 })
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

        await prisma.user.delete({
            where: { id: BigInt(id) },
        })

        return NextResponse.json({ message: 'Xoá thành công' })
    } catch (error) {
        console.error('[DELETE /api/project]', error)
        return NextResponse.json({ error: 'Lỗi khi xoá project' }, { status: 500 })
    }
}

