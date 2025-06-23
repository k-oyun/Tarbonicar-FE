import React, { useState } from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

import logoImgDark from "../assets/imgs/logoDark.png";
import emailIcon from "../assets/imgs/emailIcon.svg";
import passwordIcon from "../assets/imgs/passwordIcon.svg";
import kakaoIcon from "../assets/imgs/kakaoIcon.svg";

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
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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

// 이메일, 비밀번호 입력박스
const InputBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 15px;
  margin-bottom: 10px;
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

  const handleLogin = async (e) => {
    e.preventDefault();
    alert("API 연동 전 테스트");
  };

  return (
    <Container $isMobile={isMobile}>
      <LoginBox>
        <Logo src={logoImgDark} alt="로고 이미지" />
        <form onSubmit={handleLogin}>
          <InputBox>
            <Email src={emailIcon} alt="이메일 아이콘" />
            <Input
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputBox>

          <InputBox>
            <Password src={passwordIcon} alt="비밀번호 아이콘" />
            <Input
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputBox>

          <SubText>아이디 or 비밀번호 재설정</SubText>

          <LoginButton type="submit" disabled={!email || !password}>
            로그인
          </LoginButton>
        </form>

        <KakaoButton>
          <Kakao src={kakaoIcon} alt="카카오 아이콘" />
          카카오 로그인
        </KakaoButton>

        <BottomText>계정이 없으신가요?</BottomText>
      </LoginBox>
    </Container>
  );
};

export default Login;
