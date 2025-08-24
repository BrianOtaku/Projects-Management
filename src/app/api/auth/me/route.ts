import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { normalizeData } from "@/lib/utils";

export async function GET() {
    try {
        const decoded = await getCurrentUser();

        if (!decoded?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: BigInt(decoded.id) },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                teamId: true,
                leader: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(normalizeData(user), { status: 200 });
    } catch (error) {
        console.error("Error in /api/auth/me:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
            include: { leader: true },
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
