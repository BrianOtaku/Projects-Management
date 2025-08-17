import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { signToken } from '@/lib/utils';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json(
                { message: "Sai email hoặc mật khẩu" },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: "Sai email hoặc mật khẩu" },
                { status: 401 }
            );
        }

        const token = signToken({
            id: Number(user.id),
            email: user.email,
            role: user.role,
        });

        const res = NextResponse.json({ message: "Đăng nhập thành công" });

        res.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
        });

        return res;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
    }
}
