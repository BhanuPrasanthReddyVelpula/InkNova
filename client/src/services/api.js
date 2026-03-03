import axios from "axios";

const API = axios.create({
  baseURL: "https://inknova-1-7j3i.onrender.com",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;