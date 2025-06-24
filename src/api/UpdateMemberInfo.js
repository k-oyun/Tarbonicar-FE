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

export const updateProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("/api/v1/member/profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data.imageUrl;
  } catch (err) {
    console.error("프로필 이미지 변경 실패:", err);
    throw err;
  }
};

export const deleteMember = async () => {
  const res = await axios.delete("/api/v1/member/delete");
  return res.data;
};
