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

  const userInfoGet = async () => {
    return await axios.get("/api/v1/member/user-info");
  };

  return { signup, login, kakaoLogin, checkEmail, userInfoGet };
};

export default memberApi;
