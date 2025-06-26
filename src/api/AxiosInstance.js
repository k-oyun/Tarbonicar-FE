import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://www.tarbonicar.kro.kr:81",
});

const token = localStorage.getItem("refreshToken");
const reissue = async (refreshToken) => {
  return axios.post("https://www.tarbonicar.kro.kr:81/api/v1/member/reissue", {
    refreshToken: refreshToken,
  });
};
const getToken = async () => {
  const res = await reissue(token);
  if (res.data.status !== 200) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  } else {
    const accessToken = res.data.data.accessToken;
    localStorage.setItem("accessToken", accessToken);
  }
};

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
    if (error.response?.status === 401) {
      getToken();
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
