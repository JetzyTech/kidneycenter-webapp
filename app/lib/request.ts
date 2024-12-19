import axios from 'axios';

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
});

request.interceptors.request.use((config) => {
  /// Set Token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Add a response interceptor
request.interceptors.response.use(
  function (response) {
    // if (response.data.status !== 'success') {
    //   throw { ...response.data };
    // }
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default request;
