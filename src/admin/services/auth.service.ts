import axios from "axios";

const API = "/api/auth";

export const login = async (username: string, password: string) => {
  const { data } = await axios.post(`${API}/login`, {
    username,
    password,
  });

  return data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  const { data } = await axios.get(`${API}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
