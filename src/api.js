import axios from "axios";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const api = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:5000/api"
    : "https://event-management-3-lrjb.onrender.com/api",
  withCredentials: true,
});

export default api;