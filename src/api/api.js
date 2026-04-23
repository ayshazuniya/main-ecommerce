import axios from "axios";

const API = axios.create({
  baseURL: "https://main-ecommerce-mf9q.onrender.com/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Token ${token}`;
  }
  return req;
});

export default API;