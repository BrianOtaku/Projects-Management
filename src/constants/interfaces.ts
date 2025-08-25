export enum Role {
    MANAGER = "MANAGER",
    LEADER = "LEADER",
    STAFF = "STAFF",
    AI = "AI",
}

export enum Status {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
    PENDING = "PENDING",
    OVERDUE = "OVERDUE",
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
    teamId?: number;
    team?: Team;
    tasks?: Task[];

    startDate: Date;
    dueDate: Date;
    completeAt?: Date;

    submit: boolean;
    accept: boolean;
    canceled: boolean;
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
    completeAt?: Date;

    submit: boolean;
    accept: boolean;
    canceled: boolean;
}

export interface Message {
    id: number;
    userId?: number;
    user?: User;
    content: string;
    role: Role;
    createdAt: Date;
}
