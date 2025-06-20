import axios from "./AxiosInstance";

const useArticleWriteApi = () => {
    // 카테고리 : 차종 / 차량 / 연식
    const carTypeGet = async () => {
        return await axios.get("/api/v1/category/search/cartype");
    };

    const carNameGet = async (carType) => {
        return await axios.get(`/api/v1/category/search/carname?carType=${carType}`);
    };

    const carAgeGet = async (carName) => {
        return await axios.get(`/api/v1/category/search/carage?carName=${carName}`);
    };

    // 이미지 업로드
    const imageUpload = async (formData) => {
        return await axios.post("/api/v1/s3/upload-image", formData);
    };

    // 게시글 작성
    const articleWrite = async (payload) => {
        return await axios.post("/api/v1/article", payload);
    };

    return {
        carTypeGet,
        carNameGet,
        carAgeGet,
        imageUpload,
        articleWrite,
    };
};

export default useArticleWriteApi;