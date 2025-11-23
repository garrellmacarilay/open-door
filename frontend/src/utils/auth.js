import api from './api';

export const getUserFromToken = async () => {
  try {
    const { data } = await api.get('/show/user'); // calls Laravel endpoint
    return data.user; // returns user object { id, name, role, ... }
  } catch (err) {
    return null; // if token invalid or request fails
  }
};
