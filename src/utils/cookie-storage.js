import Cookies from 'universal-cookie';
import dayjs from 'dayjs';
import { StorageKeys } from 'constants/storage-keys';

const cookies = new Cookies();

export const CookieStorage = {
  getCookieData(key) {
    return cookies.get(key);
  },
  setCookieData(key, data, path) {
    const expires = dayjs().add(1, 'month').toDate();

    return cookies.set(key, data, {
      expires,
      path: path || '/',
    });
  },
  clearCookieData(key, path) {
    return cookies.remove(key, {
      path: path || '/',
    });
  },
  getCurrentUser() {
    return cookies.get(StorageKeys.UserInfo);
  },
  getAccessToken() {
    return cookies.get(StorageKeys.AccessToken);
  },
  isAuthenticated() {
    return !!cookies.get(StorageKeys.AccessToken);
  },
  clearSession(path) {
    cookies.remove(StorageKeys.AccessToken, {
      path: path || '/',
    });
    cookies.remove(StorageKeys.UserInfo, {
      path: path || '/',
    });
  },
};
