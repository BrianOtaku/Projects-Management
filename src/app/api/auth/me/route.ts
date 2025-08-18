import { NextResponse } from "next/server";
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

