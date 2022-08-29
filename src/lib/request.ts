/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios, { AxiosResponse, default as Axios } from 'axios';
import { AxiosError, ResponseMessage } from './api';
import { API_ENDPOINT, auth_module } from './config';

export function getLocalRefreshToken(): string {
  const refreshToken: string | null = localStorage.getItem('accessToken')!;
  return refreshToken;
}

const request = Axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

let refresh_token: Promise<AxiosResponse<Record<string, unknown>>> | null = null;

// refresh-token
const fetch_refresh_token = ():Promise<AxiosResponse<Record<string, unknown>>> => {
  const response = axios.post(
    `${API_ENDPOINT}${auth_module}/refreshtoken`,
    {},
    {
      withCredentials: true
    }
  ).then((response) => response)
    .catch((err) => {
      const token = getLocalRefreshToken();
      const error = err as AxiosError<unknown>;
      if (Object.values<string>(ResponseMessage).includes(error?.response?.data?.message as ResponseMessage)) {
        axios
          .post(
            `${API_ENDPOINT}${auth_module}/logout`,
            {},
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
      }
    });
  return response as Promise<AxiosResponse<Record<string, unknown>>>;
};

// For Request
request.interceptors.request.use(
  async(config) => {
    const token = getLocalRefreshToken();
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// For Response
request.interceptors.response.use(
  (response) => response,
  async(error) => {
    const config = error.config;
    if (error.response.status === 410) {
      window.location.href = '/subscription/expired';
    }
    if(error.response && error.response.status === 401 && !(Object.values<string>(ResponseMessage).includes(error?.response?.data?.message as ResponseMessage))) {
      return Promise.reject(error);
    }
    if (error.response && error.response.status === 401 && !config._retry) {
      config._retry = true;
      try {
        refresh_token = refresh_token ? refresh_token : fetch_refresh_token();
        const response = await refresh_token;
        refresh_token = null;
        const responseData = (response?.data as {data:{token:string}}).data.token;
        if (responseData) {
          localStorage.setItem('accessToken', responseData);
          config.headers = {
            Authorization: `Bearer ${responseData}`
          };
        }
        return request(config);
      } catch (err) {
        window.localStorage.clear();
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

const setToken = (token: string | number | boolean): void => {
  request.interceptors.request.use((config) => {
    config.headers = {
      Authorization: `Bearer ${token}`
    };
  });
};

export { request, setToken };
