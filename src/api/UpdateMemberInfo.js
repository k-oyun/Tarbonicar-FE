import axios from "./AxiosInstance";

export const updateNickname = async (newNickname) => {
  try {
    const res = await axios.put("/api/v1/member/nickname", {
      nickname: newNickname,
    });
    return res.data;
  } catch (err) {
    console.error("닉네임 변경 실패", err);
    throw err;
  }
};

export const updatePassword = async (password, confirmPassword) => {
  try {
    const res = await axios.put("/api/v1/member/password", {
      password,
      confirmPassword,
    });
    return res.data;
  } catch (err) {
    console.error("비밀번호 변경 실패", err);
    throw err;
  }
};
