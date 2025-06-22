import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://localhost:8080/",
});

AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log(error.response);
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
