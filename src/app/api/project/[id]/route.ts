import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeData } from '@/lib/utils';

// Định nghĩa kiểu cho params
interface Params {
    id: string;
}

// Hàm GET cho route động
export async function GET(req: NextRequest, { params }: { params: Params }) {
    try {
        const { id } = params; // Lấy id từ params
        if (!id) {
            return NextResponse.json({ message: 'Thiếu id dự án' }, { status: 400 });
        }

        // Kiểm tra xem id có phải là số hợp lệ không
        if (!/^\d+$/.test(id)) {
            return NextResponse.json({ message: 'Id dự án không hợp lệ' }, { status: 400 });
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
            return NextResponse.json({ message: 'Không tìm thấy dự án' }, { status: 404 });
        }

        return NextResponse.json(normalizeData(project), { status: 200 });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu dự án:', error);
        return NextResponse.json(
            { message: 'Lỗi khi lấy dữ liệu dự án', error: error instanceof Error ? error.message : 'Lỗi không xác định' },
            { status: 500 }
        );
    }
}