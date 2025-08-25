import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/endpoints';

export async function getMessages() {
    const res = await api.get(API_ENDPOINTS.AI_CHAT);
    return res.data;
}

export async function createMessage(data: unknown) {
    const res = await api.post(API_ENDPOINTS.AI_CHAT, data);
    return res.data;
}

export async function createProjectWithAI(data: unknown) {
    const res = await api.post(API_ENDPOINTS.AI_PROJECT, data);
    return res.data;
}

export async function createTaskWithAI(id: string | number, data: unknown) {
    const res = await api.post(`${API_ENDPOINTS.AI_TASK}?id=${id}`, data);
    return res.data;
}