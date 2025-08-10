import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error('❌ JWT_SECRET is not set in .env file');
}

// Ký token
export function signToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

// Xác thực token
export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error('JWT verify error:', error);
        return null;
    }
}

// Lấy token từ cookie
export function getTokenFromCookie(req: NextRequest) {
    return req.cookies.get('auth_token')?.value || null;
}

// Lấy user hiện tại từ cookie
export async function getCurrentUser(): Promise<JwtPayload | null> {
    try {
        // Lấy token từ cookie
        const token = (await cookies()).get('token')?.value;
        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        return null;
    }
}

// Set cookie auth_token
export function setAuthCookie(res: NextResponse, token: string) {
    res.cookies.set('auth_token', token, {
        httpOnly: true, // Không cho JS đọc
        secure: process.env.NODE_ENV === 'production', // Chỉ bật secure trên production
        sameSite: 'strict', // Ngăn CSRF
        maxAge: 7 * 24 * 60 * 60, // 7 ngày
        path: '/',
    });
}

// Chuyển BigInt thành string
export function convertBigIntToString(obj: unknown): unknown {
    if (Array.isArray(obj)) {
        return obj.map(convertBigIntToString);
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                key,
                typeof value === 'bigint' ? value.toString() : convertBigIntToString(value),
            ])
        );
    }
    return obj;
}
