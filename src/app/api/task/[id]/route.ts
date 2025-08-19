import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeData } from '@/lib/utils'
import { getCurrentUser } from '@/lib/utils';

export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        const id = req.nextUrl.searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "Thiếu id task" }, { status: 400 });
        }

        if (!user || user.role == 'STAFF') {
            return NextResponse.json({ message: 'Access denied' }, { status: 403 });
        }

        const tasks = await prisma.task.findUnique({
            where: { id: BigInt(id) },
            include: {
                project: true,
                user: true,
            },
        });

        if (!tasks) {
            return NextResponse.json({ message: "Không tìm thấy task" }, { status: 404 });
        }
        return NextResponse.json(normalizeData(tasks), { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Lỗi khi lấy dữ liệu task", error }, { status: 500 });
    }
}