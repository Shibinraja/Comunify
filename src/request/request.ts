import axios, { Axios } from 'axios';

export const instance: Axios = axios.create();

// For GET requests
instance.interceptors.request.use(
  (req) => {
    // Add configurations here
    return req;
  },
  (err) => {
    return Promise.reject(err);
  },
);

// For POST requests
instance.interceptors.response.use(
  (res) => {
    // Add configurations here
    if (res.status === 201) {
      console.log('Posted Successfully');
    } else if (res.status === 401) {
      console.log('Token expired');
      // TODO refresh token work flow
    }
    return res;
  },
  (err) => {
    return Promise.reject(err);
  },
);
