import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function getCurrentUser() {
    try {
        // Lấy token từ cookie
        const token = (await cookies()).get('token')?.value;
        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string | number };

        if (!decoded?.userId) return null;

        // Truy vấn user từ database
        const user = await prisma.user.findUnique({
            where: {
                id: BigInt(decoded.userId),
            },
        });

        return user;
    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        return null;
    }
}
