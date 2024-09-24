import Store from 'electron-store';

const store = new Store();

export const getToken = () => {
  const token = store.get('token');
  return token || 'no token';
};

export const setToken = (token) => {
  store.set('token', token);
  return getToken();
};

export const getRefreshToken = () => {
  const refreshToken = store.get('refresh-token');
  return refreshToken || 'no refresh token';
};

export const setRefreshToken = (token) => {
  store.set('refresh-token', token);
  return getRefreshToken();
};
