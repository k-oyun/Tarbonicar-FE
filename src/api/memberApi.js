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

  // 비밀번호 재설정 링크 요청
  const passwordResetEmailRequest = async ({ email }) => {
    return await axios.post("/api/v1/password-reset/email-request", {
      email,
    });
  };

  // 이메일 인증 코드 검증
  const passwordResetEmailConfirm = async ({ code }) => {
    return await axios.post("/api/v1/password-reset/email-confirm", {
      code,
    });
  };

  // 새로운 비밀번호 설정
  const passwordReset = async ({ code, newPassword }) => {
    return await axios.post("/api/v1/password-reset/password-reset", {
      code,
      newPassword,
    });
  };

  return { signup, login, kakaoLogin, checkEmail, passwordResetEmailRequest, passwordResetEmailConfirm, passwordReset };
};

export default memberApi;
