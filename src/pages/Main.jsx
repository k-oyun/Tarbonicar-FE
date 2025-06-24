import styled from "styled-components";
import video1 from "../assets/videos/video1.mp4";
import downArrow from "../assets/imgs/downArrow.png";
import Car from "../assets/imgs/car.png";
import { floatUpDown, fadeDown } from "../styles/animation";
import { useEffect, useRef, useState } from "react";
import SelectBox from "../components/SelectBox";
import Header from "../components/Header";
import { useMediaQuery } from "react-responsive";
import useMainApi from "../api/main";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
`;

const VideoContainer = styled.div`
  background-color: black;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  scroll-snap-align: start;
`;

const Video = styled.video`
  width: 100%;
  height: 100vh;
  object-fit: cover;
`;

const DownArrowIcon = styled.img`
  width: 40px;
  height: 25px;
  position: absolute;
  bottom: 100px;
  cursor: pointer;
  animation: ${floatUpDown} 1s infinite;
`;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  scroll-snap-align: start;
`;

const CarImg = styled.img`
  width: ${(props) => (props.$ismobile ? "350px" : "700px")};
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: ${(props) => (props.$ismobile ? "310px" : "570px")};
  margin-top: ${(props) => props.$mt};
`;

const LogoText = styled.span`
  font-size: ${(props) => (props.$ismobile ? "30px" : "40px")};
  color: #002c5f;
  font-weight: 900;
`;

const SubText = styled.span`
  font-size: ${(props) => (props.$ismobile ? "15px" : "28px")};
  color: #002c5f;
  font-weight: 800;
`;

const DescContainer = styled.div`
  display: ${(props) => (props.$isBtnPressed ? "none" : "flex")};
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.$ismobile ? "330px" : "470px")};
  height: 80px;
  font-size: ${(props) => (props.$ismobile ? "12px" : "16px")};
  color: #002c5f;
  font-weight: 400;
  margin-top: ${(props) => (props.$ismobile ? "15px" : "30px")};
  line-height: ${(props) => (props.$ismobile ? "25px" : "32px")};
`;

const SelectBoxContainer = styled.div`
  display: ${(props) => (props.$isBtnPressed ? "flex" : "none")};
  width: 380px;
  height: ${(props) => (props.$isBtnVisible ? "70px" : "220px")};
  margin-top: 10px;
  justify-content: space-between;
  animation: ${fadeDown} 0.3s ease-in-out;
`;

const WatchReviewBtn = styled.button`
  display: ${(props) => (props.$isBtnVisible === false ? "none" : "flex")};
  width: 150px;
  height: 43px;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 10px;
  background-color: #002c5f;
  margin-top: 20px;
  color: white;
  cursor: pointer;
`;
const Main = () => {
  const reviewRef = useRef(null);
  const [isBtnPressed, setIsBtnPressed] = useState(false);
  const [isBtnVisible, setIsBtnVisible] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [isReviewVisible, setIsReviewVisible] = useState(false);
  const isMobile = useMediaQuery({
    query: "(max-width:767px)",
  });
  const [carType, setCarType] = useState([]);

  const [carName, setCarName] = useState([]);
  const [carYear, setCarYear] = useState([]);
  const navigate = useNavigate();
  const handleDownBtn = () => {
    reviewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onClickReviewBtn = () => {
    setIsBtnPressed(true);
    setIsBtnVisible(false);
    if (selectedType && selectedModel && selectedYear) {
      navigate("/article-list", {
        state: { type: selectedType, name: selectedModel, year: selectedYear },
      });
    }
  };

  useEffect(() => {
    if (selectedType && selectedModel && selectedYear !== "") {
      setIsBtnVisible(true);
    }
    console.log(selectedType, selectedModel, selectedYear);
  }, [selectedType, selectedModel, selectedYear]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsReviewVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
      }
    );

    if (reviewRef.current) {
      observer.observe(reviewRef.current);
    }

    return () => {
      if (reviewRef.current) observer.unobserve(reviewRef.current);
    };
  }, []);
  // const { carTypeGet, carNameGet, carAgeGet } = useMainApi();

  const carTypeGet = async () => {
    const url = "http://localhost:8080/api/v1/category/search/cartype";
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error("차종 GET:", error);
    }
  };
  useEffect(() => {
    const typeGet = async () => {
      const res = await carTypeGet();
      if (res && Array.isArray(res.data)) {
        const carTypeList = [
          { id: 0, value: "all", label: "전체보기" },
          ...res.data.map((item) => ({
            id: item.id,
            value: item.carType,
            label: item.carType,
          })),
        ];
        setCarType(carTypeList);
      }
    };

    typeGet();
  }, []);
  const carNameGet = async () => {
    const url = `http://localhost:8080/api/v1/category/search/carname?carType=${selectedType}`;
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error("차 이름 GET:", error);
    }
  };

  useEffect(() => {
    if (selectedType === "all") {
      setSelectedModel("all");
      setSelectedYear("all");
      setCarName([{ id: 0, value: "all", label: "전체보기" }]);
      return;
    }
    if (isBtnPressed) {
      const nameGet = async () => {
        const res = await carNameGet();
        if (res && Array.isArray(res.data)) {
          const carNameList = [
            { id: 0, value: "all", label: "전체보기" },
            ...res.data.map((item) => ({
              id: item.id,
              value: item.carName,
              label: item.carName,
            })),
          ];
          setCarName(carNameList);
          console.log(name);
        }
      };
      nameGet();
    }
  }, [selectedType]);

  const carAgeGet = async () => {
    const url = `http://localhost:8080/api/v1/category/search/home/carage?carType=${selectedType}&carName=${selectedModel}`;
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error("차 연식 GET:", error);
    }
  };

  useEffect(() => {
    if (isBtnPressed) {
      const ageGet = async () => {
        const res = await carAgeGet();
        if (res && Array.isArray(res.data)) {
          const carAgeList = [
            { id: 0, value: "all", label: "전체보기" },
            ...res.data.map((item) => ({
              id: item.id,
              value: item.carAge,
              label: item.carAge,
            })),
          ];
          setCarYear(carAgeList);
        }
      };
      ageGet();
    }
  }, [selectedModel]);
  return (
    <>
      <Header
        isReviewVisible={isReviewVisible}
        backgroundColor={"rgba(0, 0, 0, 0.3)"}
        textColor={"white"}
        logoColor={"white"}
        border={false}
      />
      <MainContainer>
        <VideoContainer>
          <Video
            src={video1}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
          />
          <DownArrowIcon src={downArrow} onClick={handleDownBtn} />
        </VideoContainer>
        <ReviewContainer ref={reviewRef}>
          <CarImg src={Car} $ismobile={isMobile} />
          <TextContainer $mt="30px" $ismobile={isMobile}>
            <LogoText $ismobile={isMobile}>타보니까</LogoText>
          </TextContainer>
          <TextContainer $mt="15px" $ismobile={isMobile}>
            <SubText $ismobile={isMobile}>
              현대자통차에 특화된 프리미엄 차량 커뮤니티 플랫폼
            </SubText>
          </TextContainer>
          <DescContainer $ismobile={isMobile} $isBtnPressed={isBtnPressed}>
            실제 운전자들의 시승 후기, 차량 리뷰, 차량 팁 등 신뢰도 높은 정보를
            <br /> 한곳에서 확인하고, 나와 잘 맞는 차량을 찾는 데 도움을
            받아보세요
          </DescContainer>

          <SelectBoxContainer
            $isBtnPressed={isBtnPressed}
            $isBtnVisible={isBtnVisible}
          >
            <SelectBox
              options={carType}
              value={selectedType}
              onSelect={(val) => setSelectedType(val)}
              isSelected={selectedType}
              placeholder="차종"
              width={"110px"}
              onClick={() => {
                setIsBtnVisible(false);
              }}
            />
            <SelectBox
              options={carName}
              value={selectedModel}
              onSelect={(val) => setSelectedModel(val)}
              isSelected={selectedModel}
              placeholder="차량"
              width={"110px"}
              onClick={() => {
                setIsBtnVisible(false);
              }}
            />
            <SelectBox
              options={carYear}
              value={selectedYear}
              onSelect={(val) => {
                setSelectedYear(val);
              }}
              isSelected={selectedYear}
              placeholder="연식"
              width={"110px"}
              onClick={() => {
                setIsBtnVisible(false);
              }}
            />
          </SelectBoxContainer>

          <WatchReviewBtn
            onClick={onClickReviewBtn}
            $isBtnVisible={isBtnVisible}
          >
            후기보기
          </WatchReviewBtn>
        </ReviewContainer>
      </MainContainer>
    </>
  );
};
export default Main;
