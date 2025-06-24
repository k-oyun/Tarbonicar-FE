import React, { useState } from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

import logoImgDark from "../assets/imgs/logoDark.png";
import emailIcon from "../assets/imgs/emailIcon.svg";
import passwordIcon from "../assets/imgs/passwordIcon.svg";
import kakaoIcon from "../assets/imgs/kakaoIcon.svg";
import memberApi from "../api/memberApi";
import ConfirmDialog from "../components/ConfirmDialog";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: ${(props) => (props.$isMobile ? "30px" : "24px")};
`;

const LoginBox = styled.div`
  background-color: white;
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  border-radius: ${(props) => (props.$isMobile ? "0" : "8px")};
  box-shadow: ${(props) =>
    props.$isMobile ? "none" : "0 4px 10px rgba(0, 0, 0, 0.1)"};
  text-align: center;
`;

// 로고 이미지
const Logo = styled.img`
  width: 120px;
  margin-bottom: 24px;
`;

// 이메일 이미지
const Email = styled.img`
  width: 17px;
  height: 15px;
  margin-right: 8px;
`;

// 비밀번호 이미지
const Password = styled.img`
  width: 15px;
  height: 15px;
  margin-right: 8px;
`;

// 카카오 이미지
const Kakao = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 4px;
`;

// 에러메시지
const ErrorText = styled.div`
  color: #e20000;
  font-size: 10px;
  margin: 2px 0 8px 4px;
  text-align: left;
`;

// 이메일, 비밀번호 입력박스
const InputBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 15px;
  margin-bottom: ${(props) => (props.$error ? "2px" : "10px")};
  background-color: #fff;

  &:hover {
    border-color: #7c7c7c;
  }
`;

// 입력창
const Input = styled.input`
  flex: 1;
  padding: 12px 0;
  border: none;
  font-size: 11px;

  &:focus {
    outline: none;
  }
`;

// 아이디, 비번찾기 텍스트
const SubText = styled.div`
  font-size: 10px;
  color: #7c7c7c;
  text-align: right;
  margin-bottom: 30px;
  cursor: pointer;
`;

// 로그인 버튼
const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${(props) => (props.disabled ? "#f2f2f2" : "#002c5f")};
  color: ${(props) => (props.disabled ? "#aaa" : "white")};
  font-weight: bold;
  font-size: 13px;
  border: none;
  border-radius: 5px;
  margin-bottom: 12px;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
`;

// 카카오 버튼
const KakaoButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #fee502;
  color: #444;
  font-weight: bold;
  font-size: 13px;
  border: none;
  border-radius: 5px;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 회원가입 안내 텍스트
const BottomText = styled.div`
  font-size: 12px;
  color: #333;
  text-decoration: underline;
  cursor: pointer;
`;

const Login = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dialog, setDialog] = useState({ isOpen: false });

  const [emailError, setEmailError] = useState("");
  const [pwError, setPwError] = useState("");

  const validateEmail = (email) => {
    const trimmed = email.trim();
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(trimmed);
  };

  const validatePassword = (password) => {
    const trimmed = password.trim();
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':",.<>?]).{8,}$/;
    return regex.test(trimmed);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await memberApi().login({
        email: email.trim(),
        password: password.trim(),
      });

      const accessToken = res.data.data.accessToken;
      const refreshToken = res.data.data.refreshToken;

      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        navigate("/");
      } else {
        throw new Error("토큰이 존재하지 않습니다.");
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      let errorMessage = "로그인 중 오류가 발생했습니다.";

      if (msg === "존재하지 않는 사용자 입니다.") {
        errorMessage = "등록되지 않은 이메일입니다.";
      } else if (msg === "비밀번호가 일치하지 않습니다.") {
        errorMessage = "비밀번호가 일치하지 않습니다.";
      }
      setDialog({
        isOpen: true,
        title: "로그인 실패",
        message: errorMessage,
        isRedButton: true,
        onConfirm: () => setDialog({ isOpen: false }),
      });
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY;
      const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

      window.location.href = kakaoAuthUrl;
    } catch (err) {
      setDialog({
        isOpen: true,
        title: "카카오 로그인 실패",
        message: err.message,
        isRedButton: true,
        onConfirm: () => setDialog({ isOpen: false }),
      });
    }
  };

  return (
    <Container $isMobile={isMobile}>
      <LoginBox $isMobile={isMobile}>
        <Logo src={logoImgDark} alt="로고 이미지" />
        <form onSubmit={handleLogin}>
          <InputBox $error={!!emailError}>
            <Email src={emailIcon} alt="이메일 아이콘" />
            <Input
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              onBlur={() => {
                if (!email.trim()) {
                  setEmailError("이메일을 입력해주세요.");
                } else if (!validateEmail(email)) {
                  setEmailError("올바른 이메일 형식을 입력해주세요.");
                } else {
                  setEmailError("");
                }
              }}
            />
          </InputBox>
          {emailError && <ErrorText>{emailError}</ErrorText>}

          <InputBox $error={!!pwError}>
            <Password src={passwordIcon} alt="비밀번호 아이콘" />
            <Input
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPwError("");
              }}
              onFocus={() => {
                if (!email.trim()) setEmailError("이메일을 입력해주세요.");
                else if (!validateEmail(email))
                  setEmailError("올바른 이메일 형식을 입력해주세요.");
              }}
              onBlur={() => {
                if (!password.trim()) setPwError("비밀번호를 입력해주세요.");
                else if (!validatePassword(password))
                  setPwError(
                    "비밀번호는 대소문자·숫자·특수문자 포함 8자 이상이어야 합니다."
                  );
              }}
            />
          </InputBox>
          {pwError && <ErrorText>{pwError}</ErrorText>}

          <SubText>아이디 or 비밀번호 재설정</SubText>

          <LoginButton type="submit" disabled={!email || !password}>
            로그인
          </LoginButton>
        </form>

        <KakaoButton onClick={handleKakaoLogin}>
          <Kakao src={kakaoIcon} alt="카카오 아이콘" />
          카카오 로그인
        </KakaoButton>

        <BottomText onClick={() => navigate("/signup")}>
          계정이 없으신가요?
        </BottomText>
      </LoginBox>

      <ConfirmDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        isRedButton={dialog.isRedButton}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel || (() => setDialog({ isOpen: false }))}
      />
    </Container>
  );
};

export default Login;
