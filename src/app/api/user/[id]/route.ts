import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeData } from '@/lib/utils'

export async function GET(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ message: "Thiếu id user" }, { status: 400 });
        }
        const users = await prisma.user.findMany({
            include: {
                tasks: true,
                team: true,
            },
        })
        return NextResponse.json(normalizeData(users), { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Lỗi khi lấy users', error }, { status: 500 })
    }
}
