import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/endpoints';

export async function getProjects() {
    const res = await api.get(API_ENDPOINTS.PROJECT);
    return res.data;
}

export async function getProject(id: string | number) {
    const res = await api.get(`${API_ENDPOINTS.PROJECT_ID}${id}`);
    return res.data;
}

export async function createProject(data: unknown) {
    const res = await api.post(API_ENDPOINTS.PROJECT, data);
    return res.data;
}

export async function updateProject(id: string | number, data: unknown) {
    const res = await api.put(`${API_ENDPOINTS.PROJECT}?id=${id}`, data);
    return res.data;
}

export async function updateProjectStatus(id: string, data: { submit?: boolean; accept?: boolean; canceled?: boolean }) {
    const res = await api.patch(`${API_ENDPOINTS.PROJECT}?id=${id}`, data);
    return res.data;
}

export async function deleteProject(id: string | number) {
    const res = await api.delete(`${API_ENDPOINTS.PROJECT}?id=${id}`);
    return res.data;
}
