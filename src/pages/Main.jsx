import styled from "styled-components";
import video1 from "../assets/videos/video1.mp4";
import downArrow from "../assets/imgs/downArrow.png";
import Car from "../assets/imgs/car.png";
import { floatUpDown, fadeDown } from "../styles/animation";
import { useEffect, useRef, useState } from "react";
import SelectBox from "../components/SelectBox";
import Header from "../components/header";

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
  width: 700px;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 570px;
  margin-top: ${(props) => props.$mt};
`;

const LogoText = styled.span`
  font-size: 40px;
  color: #002c5f;
  font-weight: 900;
`;

const SubText = styled.span`
  font-size: 28px;
  color: #002c5f;
  font-weight: 800;
`;

const DescContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 470px;
  height: 80px;
  font-size: 16px;
  color: #002c5f;
  font-weight: 400;
  margin-top: 30px;
  line-height: 32px;
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
  const carType = [
    { label: "전체보기", value: "all" },
    { label: "승용차", value: "sedan" },
    { label: "SUV", value: "suv" },
    { label: "EV", value: "ev" },
    { label: "승합차", value: "van" },
  ];
  const carModel = [
    { label: "전체보기", value: "all" },
    { label: "아반떼", value: "avante" },
    { label: "소나타", value: "sonata" },
    { label: "그랜저", value: "granduer" },
    { label: "코나", value: "kona" },
  ];
  const carYear = [
    { label: "전체보기", value: "all" },
    { label: "2016", value: 2016 },
    { label: "2017", value: 2017 },
    { label: "2018", value: 2018 },
    { label: "2019", value: 2019 },
  ];
  const handleDownBtn = () => {
    reviewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onClickReviewBtn = () => {
    setIsBtnPressed(true);
    setIsBtnVisible(false);
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

  return (
    <>
      <Header isReviewVisible={isReviewVisible} />
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
          <CarImg src={Car} />
          <TextContainer $mt="30px">
            <LogoText>타보니까</LogoText>
          </TextContainer>
          <TextContainer $mt="15px">
            <SubText>현대자통차에 특화된 프리미엄 차량 커뮤니티 플랫폼</SubText>
          </TextContainer>
          <DescContainer>
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
              onClick={() => {
                setIsBtnVisible(false);
              }}
            />
            <SelectBox
              options={carModel}
              value={selectedModel}
              onSelect={(val) => setSelectedModel(val)}
              isSelected={selectedModel}
              placeholder="차량"
              onClick={() => {
                setIsBtnVisible(false);
              }}
            />
            <SelectBox
              options={carYear}
              value={selectedYear}
              onSelect={(val) => {
                console.log("부모가 받은 값", val);
                setSelectedYear(val);
              }}
              isSelected={selectedYear}
              placeholder="연식"
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
