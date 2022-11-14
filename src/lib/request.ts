/* eslint-disable space-before-function-paren */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios, { AxiosResponse, default as Axios } from 'axios';
import { ResponseMessage } from './api';
import { API_ENDPOINT, auth_module } from './config';
// import { decodeToken } from './decodeToken';
// import { DecodeToken } from '../modules/authentication/interface/auth.interface';
// import cookie from 'react-cookies';

export function getLocalRefreshToken(): string {
  const refreshToken: string | null = localStorage.getItem('accessToken')!;
  return refreshToken;
}

// const accessToken = localStorage.getItem('accessToken') || cookie.load('x-auth-cookie');
// const decodedToken: DecodeToken = accessToken && decodeToken(accessToken);

const request = Axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

let refresh_token: Promise<AxiosResponse<Record<string, unknown>>> | null = null;

// refresh-token
export const fetch_refresh_token = (): Promise<AxiosResponse<Record<string, unknown>>> => {
  const response = axios
    .post(
      `${API_ENDPOINT}${auth_module}/refreshtoken`,
      {},
      {
        withCredentials: true
      }
    )
    .then((response) => response);
  return response as Promise<AxiosResponse<Record<string, unknown>>>;
};

// For Request
request.interceptors.request.use(
  async (config) => {
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
  async (error) => {
    const config = error.config;
    if (error.response.status === 403) {
      window.location.href = '/subscription/expired';
    }
    if (error.response.status === 402) {
      window.location.href = `/subscription/expired/activate-subscription?paymentStatus=paymentFailed`;
    }
    if (
      error.response &&
      error.response.status === 401 &&
      !Object.values<string>(ResponseMessage).includes(error?.response?.data?.message as ResponseMessage)
    ) {
      return Promise.reject(error);
    }
    if (error.response && error.response.status === 401 && !config._retry) {
      config._retry = true;
      try {
        refresh_token = refresh_token ? refresh_token : fetch_refresh_token();
        const response = await refresh_token;
        refresh_token = null;
        const responseData = (response?.data as { data: { token: string } }).data.token;
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
        return Promise.reject(err);
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
