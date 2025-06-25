// src/context/UserContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/AxiosInstance"; // ⚠️ 실제 axios 인스턴스 경로에 맞게 수정하세요

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    nickname: "",
    profileImage: "",
  });

  // ✅ 유저 정보 불러오기 (accessToken 있을 경우만)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get("/api/v1/member/user-info"); // 유저 정보 API
        const { nickname, profileImage } = res.data.data;
        setUser({ nickname, profileImage });
      } catch (err) {
        console.error("유저 정보 로딩 실패:", err);
      }
    };

    if (localStorage.getItem("accessToken")) {
      fetchUserInfo();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
