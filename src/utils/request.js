import axios from 'axios';
import qs from 'qs';

import { CookieStorage } from './cookie-storage';
import { ErrorApi } from 'constants/error';
import { ROOT_API, ToastStatus } from 'constants/common';
import { toast } from 'components/Toast';

const axiosConfig = {
  baseURL: ROOT_API,
  timeout: 120000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' }),
};

export const request = axios.create(axiosConfig);

request.interceptors.request.use(
  function (config) {
    const accessToken = CookieStorage.getAccessToken();

    if (accessToken) {
      config.headers['pToken'] = accessToken;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (errorResponse) {
    const { error, errors, msg } = errorResponse?.response?.data || {};
    const message = ErrorApi?.[error || errors?.[0]?.msg || msg] || error || errors?.[0]?.msg || msg;

    toast.showMessageError(message);

    if (errorResponse?.response?.status === 401) {
      CookieStorage.clearSession();
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);
