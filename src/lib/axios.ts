import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '', // Ví dụ: http://localhost:3000
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Cho phép gửi cookies theo request
});

export default api;
