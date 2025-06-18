import styled from "styled-components";
import video1 from "../assets/videos/video1.mp4";
import downArrow from "../assets/imgs/downArrow.png";
import Car from "../assets/imgs/car.png";
import { floatUpDown, fadeDown, moveDown } from "../styles/animation";
import { useRef, useState } from "react";

const MainContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  scroll-snap-type: y mandatory;
`;

const VideoContainer = styled.div`
  background-color: black;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Video = styled.video`
  width: 100%;
  height: 100vh;
  object-fit: contain;
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
  width: 470px;
  font-size: 16px;
  color: #002c5f;
  font-weight: 400;
  margin-top: 30px;
  line-height: 32px;
`;

const SelectBoxContainer = styled.div`
  display: flex;
  width: 380px;
  margin-top: 10px;
  justify-content: space-between;
  animation: ${fadeDown} 0.3s ease-in-out;
`;

const SelectBox = styled.select`
  width: 110px;
  height: 45px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  color: #d9d9d9;
  text-align: start;
`;

const WatchReviewBtn = styled.button`
  width: 150px;
  height: 43px;
  border-radius: 10px;
  background-color: #002c5f;
  margin-top: 20px;
  color: white;
  cursor: pointer;
`;
const Main = () => {
  const reviewRef = useRef(null);
  const [isBtnPressed, setIsBtnPressed] = useState(false);
  const handleDownBtn = () => {
    reviewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onClickReviewBtn = () => {
    setIsBtnPressed(true);
  };
  return (
    <MainContainer>
      <VideoContainer>
        <Video src={video1} autoPlay muted loop playsInline controls={false} />
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
        {isBtnPressed ? (
          <SelectBoxContainer>
            <SelectBox>
              <option>차종</option>
            </SelectBox>
            <SelectBox>
              <option>차량</option>
            </SelectBox>
            <SelectBox>
              <option>연식</option>
            </SelectBox>
          </SelectBoxContainer>
        ) : null}
        <WatchReviewBtn onClick={onClickReviewBtn} $isBtnPressed={isBtnPressed}>
          후기보기
        </WatchReviewBtn>
      </ReviewContainer>
    </MainContainer>
  );
};
export default Main;
