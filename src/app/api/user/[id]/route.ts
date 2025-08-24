import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeData } from '@/lib/utils'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: paramId } = await params;
        const queryId = req.nextUrl.searchParams.get('id');
        const id = paramId || queryId;

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
