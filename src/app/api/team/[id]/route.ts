import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeData } from '@/lib/utils'

export async function GET(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ message: "Thiếu id team" }, { status: 400 });
        }
        const team = await prisma.team.findUnique({
            where: { id: BigInt(id) },
            include: {
                members: true,
                leader: true,
                project: true,
            },
        })
        return NextResponse.json(normalizeData(team), { status: 200 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}
