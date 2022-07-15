import Axios from 'axios';
import { API_ENDPOINT } from './config';

export function getLocalRefreshToken(): string | null {
    const refreshToken: string | null = localStorage.getItem('accessToken');
    return refreshToken;
}

const request = Axios.create({
    baseURL: API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// For Request
request.interceptors.request.use(
    config => {
        const token = getLocalRefreshToken();
        if (token) {
            config.headers = {
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

request.interceptors.response.use(
    response => response,
    error => {
      if (error.response.status === 410) {
        window.location.href = '/subscription/expired';
      }
      return Promise.reject(error);
});

const setToken = (token: string | number | boolean): void => {
    request.interceptors.request.use(config => {
        config.headers = {
            Authorization: `Bearer ${token}`,
        };
    });
};

export { request, setToken };
