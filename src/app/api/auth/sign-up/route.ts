import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeData } from '@/lib/utils'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "STAFF",
            },
        });

        return NextResponse.json(normalizeData(newUser), { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Something went wrong", error },
            { status: 500 }
        );
    }
}

