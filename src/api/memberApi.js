import axios from "./AxiosInstance";

export const memberApi = () => {
  // 회원가입
  const signup = async ({ email, password, checkedPassword, nickname }) => {
    return await axios.post("/api/v1/member/signup", {
      email,
      password,
      checkedPassword,
      nickname,
    });
  };

  // 로그인
  const login = async ({ email, password }) => {
    return await axios.post("/api/v1/member/login", {
      email,
      password,
    });
  };

  // 카카오 로그인
  const kakaoLogin = async (kakaoAccessToken) => {
    return await axios.post("/api/v1/member/kakao-login", {
      kakaoAccessToken,
    });
  };

  return { signup, login, kakaoLogin };
};

export default memberApi;
