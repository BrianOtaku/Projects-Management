import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeData } from '@/lib/utils'
import { getCurrentUser } from '@/lib/utils'

export async function GET() {
    try {
        const team = await prisma.team.findMany({
            include: {
                members: true,
                leader: true,
                project: true,
            },
        })
        return NextResponse.json(normalizeData(team), { status: 200 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const user = await getCurrentUser()

    if (!user || user.role !== 'MANAGER') {
        return NextResponse.json({ message: 'Only manager can create a team' }, { status: 403 })
    }

    try {
        const body = await req.json()
        const { teamName, leaderId } = body

        const leader = await prisma.user.findUnique({
            where: { id: BigInt(leaderId) },
            select: { role: true }
        });

        if (!leader) {
            return NextResponse.json({ message: 'Leader not found' }, { status: 404 });
        }

        if (leader.role !== 'LEADER') {
            return NextResponse.json({ message: 'Provided user is not a leader' }, { status: 400 });
        }

        if (!teamName || !leaderId) {
            return NextResponse.json({ message: 'Missing teamName or leaderId' }, { status: 400 })
        }

        const newTeam = await prisma.team.create({
            data: {
                teamName,
                leaderId: BigInt(leaderId),
            },
            include: { members: true },
        })

        return NextResponse.json(normalizeData(newTeam), { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: 'Error creating team or project already have a team', error }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'MANAGER') {
        return NextResponse.json({ message: 'Only manager can update a team' }, { status: 403 });
    }

    try {
        const id = req.nextUrl.searchParams.get('id')

        if (!id) {
            return NextResponse.json({ message: 'Missing teamId in query' }, { status: 400 });
        }

        const body = await req.json();
        const { teamName, leaderId } = body;

        const leader = await prisma.user.findUnique({
            where: { id: BigInt(leaderId) },
            select: { role: true }
        });

        if (!leader) {
            return NextResponse.json({ message: 'Leader not found' }, { status: 404 });
        }

        if (leader.role !== 'LEADER') {
            return NextResponse.json({ message: 'Provided user is not a leader' }, { status: 400 });
        }

        if (!teamName || !leaderId) {
            return NextResponse.json({ message: 'Missing teamName or leaderId' }, { status: 400 })
        }

        const existingTeam = await prisma.team.findUnique({
            where: { id: BigInt(id) }
        });
        if (!existingTeam) {
            return NextResponse.json({ message: 'Team not found' }, { status: 404 });
        }

        const updatedTeam = await prisma.team.update({
            where: { id: BigInt(id) },
            data: {
                teamName: teamName ?? existingTeam.teamName,
                leaderId: BigInt(leaderId) ?? existingTeam.leaderId,
            }
        });

        return NextResponse.json(normalizeData(updatedTeam), { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error updating team', error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'MANAGER') {
        return NextResponse.json({ message: 'Only manager can delete a team' }, { status: 403 });
    }

    try {
        const id = req.nextUrl.searchParams.get('id')

        if (!id) {
            return NextResponse.json({ message: 'Missing teamId in query' }, { status: 400 });
        }

        const existingTeam = await prisma.team.findUnique({
            where: { id: BigInt(id) }
        });
        if (!existingTeam) {
            return NextResponse.json({ message: 'Team not found' }, { status: 404 });
        }

        await prisma.team.delete({
            where: { id: BigInt(id) }
        });

        return NextResponse.json({ message: 'Team deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting team', error }, { status: 500 });
    }
}
