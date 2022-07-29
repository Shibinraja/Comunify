import { default as Axios, default as axios } from 'axios';
import { showErrorToast } from 'common/toast/toastFunctions';
import { isBefore } from 'date-fns';
import { DecodeToken } from 'modules/authentication/interface/auth.interface';
import { API_ENDPOINT, auth_module } from './config';
import { decodeToken } from './decodeToken';

export function getLocalRefreshToken(): string  {
  const refreshToken: string | null = localStorage.getItem('accessToken')!;
  return refreshToken;
}

const request = Axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials:true
});

// For Request
request.interceptors.request.use(
  async(config) => {
    const token = getLocalRefreshToken();
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }
    const user: DecodeToken | null =  decodeToken(token);
    const isExpired = user && isBefore(new Date(user?.exp * 1000), new Date());
    if (!isExpired) {return config;}

    const response = await axios.post(`${API_ENDPOINT}${auth_module}/refreshtoken`, {}, {
      withCredentials:true
    });
    if (response) {
      localStorage.setItem('accessToken', response?.data?.data?.token);
      config.headers = {
        Authorization: `Bearer ${response?.data?.data?.token}`
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// For Response
request.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = getLocalRefreshToken();
    if (error.response.status === 410) {
      window.location.href = '/subscription/expired';
    }
    if (error.response.data.message === 'Token expired') {
      axios.post(`${API_ENDPOINT}${auth_module}/logout`, {}, {
        withCredentials:true,
        headers:{
          Authorization: `Bearer ${token}`
        }
      }).then(() => {
        //
      }).catch((err) => {
        showErrorToast(err?.response?.data?.message);
        window.localStorage.clear();
        window.location.href='/';
      });

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
