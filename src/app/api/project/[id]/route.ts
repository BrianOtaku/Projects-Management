import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeData } from '@/lib/utils'

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    try {
        const id = context.params.id;
        if (!id) {
            return NextResponse.json({ message: "Thiếu id dự án" }, { status: 400 });
        }
        const project = await prisma.project.findUnique({
            where: { id: BigInt(id) },
            include: {
                team: {
                    include: {
                        members: true,
                        leader: true,
                    },
                },
                tasks: true,
            },
        });
        if (!project) {
            return NextResponse.json({ message: "Không tìm thấy dự án" }, { status: 404 });
        }
        return NextResponse.json(normalizeData(project), { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Lỗi khi lấy dữ liệu dự án", error }, { status: 500 });
    }
}