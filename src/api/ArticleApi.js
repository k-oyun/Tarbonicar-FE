import axios from './AxiosInstance.js';
import qs from "qs";

export const articleApi = () => {
    // 게시판 목록 조회
    const articleList = async (filters = {}) => {
        // filters 구조 분해, 필요없는 값은 자동 제외
        const {
            carType,
            carNames,
            carAges,
            articleTypes,
            sortType,
        } = filters;

        // params 객체 생성
        const params = {};

        if (carType) params.carType = carType;
        if (carNames && carNames.length) params.carName = carNames; // 배열 가능
        if (carAges && carAges.length) params.carAge = carAges;     // 배열 가능
        if (articleTypes && articleTypes.length) params.articleType = articleTypes; // 배열/단일 모두 가능
        if (sortType) params.sortType = sortType;

        // axios에서 배열값은 carName=aa&carName=bb 형태로 변환해줌!
        return await axios.get('/api/v1/article/list', {
            params,
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
        });
    };

    return { articleList };
};