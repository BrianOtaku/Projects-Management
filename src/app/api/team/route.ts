import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { convertBigIntToString } from '@/lib/utils'
import { getCurrentUser } from '@/lib/utils'

export async function GET() {
    try {
        const team = await prisma.team.findMany({
            include: {
                project: true,
                members: true,
            },
        })
        return NextResponse.json(convertBigIntToString(team), { status: 200 })
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
        const { teamName, projectId } = body

        if (!teamName || !projectId) {
            return NextResponse.json({ message: 'Missing teamName or projectId' }, { status: 400 })
        }

        const project = await prisma.project.findUnique({
            where: { id: BigInt(projectId) },
        })
        if (!project) {
            return NextResponse.json({ message: 'Project does not exist' }, { status: 404 })
        }

        const newTeam = await prisma.team.create({
            data: {
                teamName,
                projectId: BigInt(projectId),
            },
            include: { members: true, project: true },
        })

        return NextResponse.json(convertBigIntToString(newTeam), { status: 201 })
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
        const body = await req.json();
        const { teamId, teamName, projectId } = body;

        if (!teamId) {
            return NextResponse.json({ message: 'Missing teamId' }, { status: 400 });
        }

        const existingTeam = await prisma.team.findUnique({
            where: { id: BigInt(teamId) }
        });
        if (!existingTeam) {
            return NextResponse.json({ message: 'Team not found' }, { status: 404 });
        }

        if (projectId) {
            const projectExists = await prisma.project.findUnique({
                where: { id: BigInt(projectId) }
            });
            if (!projectExists) {
                return NextResponse.json({ message: 'Project not found' }, { status: 404 });
            }
        }

        const updatedTeam = await prisma.team.update({
            where: { id: BigInt(teamId) },
            data: {
                teamName: teamName ?? existingTeam.teamName,
                projectId: projectId ? BigInt(projectId) : existingTeam.projectId
            }
        });

        return NextResponse.json(convertBigIntToString(updatedTeam), { status: 200 });

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
        const { searchParams } = new URL(req.url);
        const teamId = searchParams.get('teamId');

        if (!teamId) {
            return NextResponse.json({ message: 'Missing teamId in query' }, { status: 400 });
        }

        const existingTeam = await prisma.team.findUnique({
            where: { id: BigInt(teamId) }
        });
        if (!existingTeam) {
            return NextResponse.json({ message: 'Team not found' }, { status: 404 });
        }

        await prisma.team.delete({
            where: { id: BigInt(teamId) }
        });

        return NextResponse.json({ message: 'Team deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting team', error }, { status: 500 });
    }
}
