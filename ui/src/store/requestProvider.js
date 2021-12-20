import axios from 'axios';
import { handleRequests } from '@redux-requests/core';
import { createDriver as createAxiosDriver } from '@redux-requests/axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: false,
});

export default handleRequests({
  driver: {
    default: createAxiosDriver(axiosInstance),
  },
});
