import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/AxiosInstance";

const KakaoRedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      // 인가 코드로 accessToken 받기
      axios
        .get(`/api/v1/member/kakao-accesstoken?code=${code}`)
        .then((res) => {
          console.log("카카오 응답:", res);
          const kakaoAccessToken = res.data.data.accessToken;

          if (!kakaoAccessToken) {
            alert("카카오 토큰이 없습니다.");
            return navigate("/login");
          }

          // 카카오 accessToken을 서버로 보내서 자체 JWT 받기
          return axios.post("/api/v1/member/kakao-login", {
            accessToken: kakaoAccessToken,
          });
        })
        .then((res) => {
          if (!res) return; // 위에서 오류 발생한 경우

          const { accessToken, refreshToken } = res.data.data;
          if (accessToken && refreshToken) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            alert("카카오 로그인 + JWT 발급 성공");
            navigate("/");
          } else {
            alert("JWT 토큰 발급 실패");
            navigate("/login");
          }
        })
        .catch((err) => {
          console.error("카카오 로그인 실패", err);
          alert("로그인 중 오류가 발생했습니다.");
          navigate("/login");
        });
    }
  }, []);

  return <div>로그인 처리 중...</div>;
};

export default KakaoRedirectPage;
