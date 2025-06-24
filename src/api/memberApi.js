import axios from "./AxiosInstance";

export const memberApi = () => {
  // 회원가입
  const signup = async ({
    email,
    password,
    checkedPassword,
    nickname,
    profileImage,
  }) => {
    return await axios.post("/api/v1/member/signup", {
      email,
      password,
      checkedPassword,
      nickname,
      profileImage,
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

  // 이메일 중복 확인
  const checkEmail = async (email) => {
    return await axios.get("/api/v1/member/email-check", {
      params: { email },
    });
  };

  return { signup, login, kakaoLogin, checkEmail };
};

export default memberApi;
