import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/utils';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    const { email, password } = await req.json()

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({
        id: Number(user.id),
        email: user.email,
        role: user.role,
    })

    return NextResponse.json({ token })
}
