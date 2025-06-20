import axios from "./AxiosInstance";

const useArticleApi = () => {
    const getArticle = async (articleId) => {
        return await axios.get("/api/v1/article", {
            params: { articleId },
        });
    };

    return {
        getArticle,
    };
};

export default useArticleApi;
