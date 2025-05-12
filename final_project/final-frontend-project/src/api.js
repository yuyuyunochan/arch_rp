import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const register = (username, email, password, role) => {
  return axios.post(`${API_URL}/users/register`, {
    username,
    email,
    password,
    role
  });
};

export const login = (username, password) => {
  return axios.post(`${API_URL}/users/login`, {
    username,
    password
  });
};