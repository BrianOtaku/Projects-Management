import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";

export async function signIn(email: string, password: string) {
    const res = await api.post(
        API_ENDPOINTS.AUTH_SIGN_IN,
        { email, password },
        { withCredentials: true } // nhận cookie token từ server
    );
    return res.data;
}

export async function signUp(name: string, email: string, password: string) {
    const res = await api.post(API_ENDPOINTS.AUTH_SIGN_UP, {
        name,
        email,
        password,
    });
    return res.data;
}

export async function signOut() {
    const res = await api.post(API_ENDPOINTS.AUTH_SIGN_OUT, {}, { withCredentials: true });
    return res.data;
}
