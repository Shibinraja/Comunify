import Axios from 'axios';
import { API_ENDPOINT } from './config';

export function getLocalRefreshToken() {
  const refreshToken = localStorage.getItem('accessToken');
  return refreshToken;
}

const request = Axios.create({
  baseURL: API_ENDPOINT,
  headers:{
    'Content-Type':'application/json',
  }
});

// For Request
request.interceptors.request.use(
  (config) => {
    const token = getLocalRefreshToken();
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const setToken = (token: string | number | boolean): void => {
  request.interceptors.request.use((config) => {
    config.headers = {
      Authorization: token,
    };
  });
};

export { request, setToken };
