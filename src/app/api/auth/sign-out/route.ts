import { NextResponse } from 'next/server';

export async function POST() {
    // Nếu dùng cookie để lưu JWT thì xóa cookie tại đây
    return NextResponse.json({ message: 'Signed out' });
}
