import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/endpoints';

export async function getTasks() {
    const res = await api.get(API_ENDPOINTS.TASK);
    return res.data;
}

export async function getTask(id: string | number) {
    const res = await api.get(API_ENDPOINTS.TASK_ID.replace('[id]', id.toString()));
    return res.data;
}

export async function createTask(data: unknown) {
    const res = await api.post(API_ENDPOINTS.TASK, data);
    return res.data;
}

export async function updateTask(id: string | number, data: unknown) {
    const res = await api.put(`${API_ENDPOINTS.TASK}?id=${id}`, data);
    return res.data;
}

export async function updateTaskStatus(id: string, data: { submit?: boolean; accept?: boolean; canceled?: boolean }) {
    const res = await api.patch(`${API_ENDPOINTS.TASK}?id=${id}`, data);
    return res.data;
}

export async function deleteTask(id: string | number) {
    const res = await api.delete(`${API_ENDPOINTS.TASK}?id=${id}`);
    return res.data;
}
