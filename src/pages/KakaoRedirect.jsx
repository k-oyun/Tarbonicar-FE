import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/AxiosInstance";
import ConfirmDialog from "../components/ConfirmDialog";

const KakaoRedirectPage = () => {
  const navigate = useNavigate();
  const [dialog, setDialog] = useState({ isOpen: false });

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
            setDialog({
              isOpen: true,
              title: "카카오 토큰 없음",
              message: "카카오 로그인에 실패했습니다.",
              showCancel: false,
              isRedButton: true,
              onConfirm: () => {
                setDialog({ isOpen: false });
                navigate("/login");
              },
            });
            return null;
            // alert("카카오 토큰이 없습니다.");
            // return navigate("/login");
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

            navigate("/");
          } else {
            setDialog({
              isOpen: true,
              title: "JWT 발급 실패",
              message: "다시 로그인해주세요.",
              showCancel: false,
              isRedButton: true,
              onConfirm: () => {
                setDialog({ isOpen: false });
                navigate("/login");
              },
            });
            // alert("JWT 토큰 발급 실패");
            // navigate("/login");
          }
        })
        .catch((err) => {
          setDialog({
            isOpen: true,
            title: "로그인 오류",
            message: "카카오 로그인 중 문제가 발생했습니다.",
            showCancel: false,
            isRedButton: true,
            onConfirm: () => {
              setDialog({ isOpen: false });
              navigate("/login");
            },
          });
          // console.error("카카오 로그인 실패", err);
          // alert("로그인 중 오류가 발생했습니다.");
          // navigate("/login");
        });
    }
  }, []);

  return (
    <ConfirmDialog
      isOpen={dialog.isOpen}
      title={dialog.title}
      message={dialog.message}
      showCancel={dialog.showCancel}
      isRedButton={dialog.isRedButton}
      onConfirm={dialog.onConfirm}
      onCancel={dialog.onCancel}
    />
  );
};

export default KakaoRedirectPage;
