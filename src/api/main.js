import axios from "./AxiosInstance";

const useMainApi = () => {
  const carTypeGet = async () => {
    return await axios.get(`/api/v1/category/search/cartype`);
  };

  const carNameGet = async (carType) => {
    return await axios.get(
      `/api/v1/category/search/carname?carType=${carType}`
    );
  };

  const carAgeGet = async (carType, carName) => {
    return await axios.get(
      `/api/v1/category/search/home/carage?carType=${carType}&carName=${carName}`
    );
  };
  return {
    carTypeGet,
    carNameGet,
    carAgeGet,
  };
};

export default useMainApi;
