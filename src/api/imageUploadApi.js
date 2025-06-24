import axios from "./AxiosInstance";

export const imageUploadApi = () => {

    // 이미지 업로드
    const postImageUploadApi = async (formData) => {
        return await axios.post("/api/v1/s3/upload-image", formData);
    };

    return { postImageUploadApi };
};