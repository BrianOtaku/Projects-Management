import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/endpoints';

export async function getTeams() {
    const res = await api.get(API_ENDPOINTS.TEAM);
    return res.data;
}

export async function getTeam(id: string | number) {
    const res = await api.get(`${API_ENDPOINTS.TEAM_ID}?id=${id}`);
    return res.data;
}

export async function createTeam(data: unknown) {
    const res = await api.post(API_ENDPOINTS.TEAM, data);
    return res.data;
}

export async function updateTeam(id: string | number, data: unknown) {
    const res = await api.put(`${API_ENDPOINTS.TEAM}?id=${id}`, data);
    return res.data;
}

export async function deleteTeam(id: string | number) {
    const res = await api.delete(`${API_ENDPOINTS.TEAM}?id=${id}`);
    return res.data;
}