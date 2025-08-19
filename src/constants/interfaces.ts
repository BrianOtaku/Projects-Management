export enum Role {
    MANAGER = "MANAGER",
    LEADER = "LEADER",
    STAFF = "STAFF",
}

export enum Status {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
}

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: Role;
    tasks: Task[];
    team?: Team;
    leader: Team[];
}

export interface Team {
    id: number;
    teamName: string;
    members: User[];
    project?: Project;
    leaderId?: number;
    leader?: User;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    status: Status;
    startDate: Date;
    dueDate: Date;
    progress: number;
    teamId?: number;
    team?: Team;
    tasks?: Task[];
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: Status;
    projectId: number;
    project?: Project;
    userId: number;
    user?: User;
    startDate: Date;
    dueDate: Date;
    reviewedByLeader: boolean;
    completeAt?: Date;
}

