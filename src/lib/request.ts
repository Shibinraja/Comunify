import Axios from 'axios';

function getLocalRefreshToken() {
  const refreshToken = localStorage.getItem('accessToken');
  return refreshToken;
}

const request = Axios.create({
  baseURL: 'http://localhost:3001/auth/v1/',
});

// For Request
request.interceptors.request.use(
  (config) => {
    const token = getLocalRefreshToken();
    if (token) {
      config.headers = {
        Authorization: token,
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
