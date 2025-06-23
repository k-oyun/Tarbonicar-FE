import axios from './AxiosInstance.js';

export const categoryApi = () => {
    // 차종 카테고리 조회
    const carTypeListApi = async () => {
        return await axios.get('/api/v1/category/search/cartype');
    };

    // 차량 카테고리 조회
    const carNameListApi = async (carType) => {
        return await axios.get('/api/v1/category/search/carname', {
            params: { carType }
        });
    };

    // 연식 목록 (차명에 따라)
    const carAgeListApi = async (carType, carName) => {
        return await axios.get('/api/v1/category/search/home/carage', {
            params: {
                carType: carType || "all",
                carName: carName || "all",
            }
        });
    };

    return {
        carTypeListApi,
        carNameListApi,
        carAgeListApi,
    };
};