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
    return req.cookies.get('token')?.value || null;
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
    res.cookies.set('token', token, {
        httpOnly: true, // Không cho JS đọc
        secure: process.env.NODE_ENV === 'production', // Chỉ bật secure trên production
        sameSite: 'strict', // Ngăn CSRF
        maxAge: 24 * 60 * 60, // 1 ngày
        path: '/',
    });
}

// Xử dữ liệu của đối tượng
export function normalizeData(obj: unknown): unknown {
    // Xử lý null hoặc undefined
    if (obj == null) {
        return obj;
    }

    // Xử lý mảng
    if (Array.isArray(obj)) {
        return obj.map(normalizeData);
    }

    // Xử lý Date
    if (obj instanceof Date) {
        return obj.toISOString().split("T")[0];
        // Trả về chuỗi ISO: "2025-08-14T00:00:00.000Z"
        // Hoặc dùng obj.toISOString().split("T")[0] nếu chỉ muốn "2025-08-14"
    }

    // Xử lý đối tượng
    if (typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                key,
                typeof value === "bigint" ? value.toString() : normalizeData(value),
            ])
        );
    }

    // Trả về giá trị nguyên bản cho các kiểu khác (string, number, boolean, v.v.)
    return obj;
}