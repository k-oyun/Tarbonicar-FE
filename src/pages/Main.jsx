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
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";

const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: ${(props) =>
    props.$selectedType === "" ? "y mandatory" : ""};
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
  width: ${(props) => (props.$ismobile ? "85%" : "35%")};
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
  const [isModalOn, setIsModalOn] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
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
    } else {
      if (!isFirstTime) {
        setIsModalOn(true);
      }
      setIsFirstTime(false);
    }
  };

  useEffect(() => {
    if (selectedType && selectedModel && selectedYear !== "") {
      setIsBtnVisible(true);
    }
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
  const { carTypeGet, carNameGet, carAgeGet } = useMainApi();

  useEffect(() => {
    const typeGet = async () => {
      const res = await carTypeGet();
      if (res && Array.isArray(res.data.data)) {
        const carTypeList = [
          { id: 0, value: "all", label: "전체보기" },
          ...res.data.data.map((item) => ({
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

  useEffect(() => {
    if (selectedType === "all") {
      setSelectedModel("all");
      setSelectedYear("all");
      setCarName([{ id: 0, value: "all", label: "전체보기" }]);
      return;
    }
    if (isBtnPressed) {
      const nameGet = async () => {
        const res = await carNameGet(selectedType);
        if (res && Array.isArray(res.data.data)) {
          const carNameList = [
            { id: 0, value: "all", label: "전체보기" },
            ...res.data.data.map((item) => ({
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

  useEffect(() => {
    if (isBtnPressed) {
      const ageGet = async () => {
        const res = await carAgeGet(selectedType, selectedModel);
        if (res && Array.isArray(res.data.data)) {
          const carAgeList = [
            { id: 0, value: "all", label: "전체보기" },
            ...res.data.data.map((item) => ({
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

  useEffect(() => {
    if (selectedType !== "all") {
      setSelectedModel("");
    }
  }, [selectedType]);

  useEffect(() => {
    if (selectedModel !== "all") {
      setSelectedYear("");
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
      <MainContainer $selectedType={selectedType}>
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
              현대자동차에 특화된 프리미엄 차량 커뮤니티 플랫폼
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
              disabled={false}
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
              disabled={selectedType === "" ? true : false}
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
              disabled={selectedModel === "" ? true : false}
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

      <ConfirmDialog
        isOpen={isModalOn}
        title="알림"
        message="차종, 모델, 연식을 전부 선택해 주세요!"
        onConfirm={() => {
          setIsModalOn((prev) => !prev);
        }}
        showCancel={false}
        isRedButton={false}
      />
    </>
  );
};
export default Main;
