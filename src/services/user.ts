import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/endpoints';

export async function getUsers() {
    const res = await api.get(API_ENDPOINTS.USER);
    return res.data;
}

export async function getUser(id: string | number) {
    const res = await api.get(`${API_ENDPOINTS.USER_ID}?id=${id}`);
    return res.data;
}

export async function getMe() {
    const res = await api.get(API_ENDPOINTS.AUTH_ME);
    return res.data;
}

export async function createUser(data: unknown) {
    const res = await api.post(API_ENDPOINTS.USER, data);
    return res.data;
}

export async function updateUser(id: string | number, data: unknown) {
    const res = await api.put(`${API_ENDPOINTS.USER}?id=${id}`, data);
    return res.data;
}

export async function updateMe(id: string | number, data: unknown) {
    const res = await api.put(`${API_ENDPOINTS.USER_ID}?id=${id}`, data);
    return res.data;
}

export async function deleteUser(id: string | number) {
    const res = await api.delete(`${API_ENDPOINTS.USER}?id=${id}`);
    return res.data;
}

export async function deleteMe(id: string | number) {
    const res = await api.delete(`${API_ENDPOINTS.USER_ID}?id=${id}`);
    return res.data;
}

