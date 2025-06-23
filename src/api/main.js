import axios from "./AxiosInstance";

const useMainApi = () => {
  const carTypeGet = async () => {
    return await axios.get(`category/search/home/cartype`);
  };

  const carNameGet = async (carType) => {
    return await axios.get(`category/search/carname?carType=${carType}`);
  };

  const carAgeGet = async (carType, carName) => {
    return await axios.get(
      `category/search/home/carage?carType=${carType}&carName=${carName}`
    );
  };
  return {
    carTypeGet,
    carNameGet,
    carAgeGet,
  };
};

export default useMainApi;
