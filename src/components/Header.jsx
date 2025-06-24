import { useEffect, useState } from "react";
import styled from "styled-components";
import logoImgDark from "../assets/imgs/logoDark.png";
import logoImgWhite from "../assets/imgs/logoWhite.png";
import sahuruImg from "../assets/imgs/Sahuru.png";
import profileIcon from "../assets/imgs/profileIcon.png";
import LogoutIcon from "../assets/imgs/LogoutIcon.png";
import { fadeDown } from "../styles/animation";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${(props) => (props.$ismobile ? "60px" : "80px")};
  border-bottom: ${(props) =>
    props.$isReviewVisible ? "1px solid #d9d9d9" : "none"};
  background-color: ${(props) =>
    props.$isReviewVisible
      ? "rgba(255, 255, 255, 0.95)"
      : "rgba(0, 0, 0, 0.3)"};
  color: ${(props) => (props.$isReviewVisible ? "#002c5f" : "white")};
  backdrop-filter: blur(8px);
  transition: background-color 0.3s ease, border-bottom 0.3s ease;
  position: fixed;
  top: 0;
  z-index: 3000;
`;

const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const UserImageContainer = styled.div`
  width: ${(props) => (props.$ismobile ? "30px" : "45px")};
  height: ${(props) => (props.$ismobile ? "30px" : "45px")};
  border-radius: 50%;
  background-color: grey;
  margin-right: 25px;
  margin-left: 15px;
  background-image: ${(props) => `url(${props.$image})`};
  background-position: center;
  background-size: cover;
  box-shadow: inset 0 0 0 1px black;
  cursor: pointer;
`;

const HeaderText = styled.span`
  font-size: ${(props) => (props.$ismobile ? "12px" : "14px")};
  color: ${(props) => (props.$isReviewVisible ? "black" : "white")};
`;

const LoginBtn = styled.button`
  width: auto;
  height: 30px;
  background-color: transparent;
  padding: 0px 5px;
  margin-right: 15px;
  font-size: ${(props) => (props.$ismobile ? "12px" : "14px")};
  border: none;
  color: ${(props) => (props.$isReviewVisible ? "black" : "white")};
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
  transition: transform 0.2s ease-in-out;
`;

const Logo = styled.img`
  width: ${(props) => (props.$ismobile ? "60px" : "100px")};
  margin-left: 30px;
  cursor: pointer;
`;

const Popup = styled.div`
  width: ${(props) => (props.$ismobile ? "130px" : "150px")};
  height: ${(props) => (props.$ismobile ? "100px" : "120px")};
  border-radius: 14px;
  background-color: white;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 20px;
  z-index: 3000;
  top: ${(props) => (props.$ismobile ? "50px" : "70px")};
  animation: ${fadeDown} 0.3s ease-out;
`;

const PopupBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 80%;
  height: 50px;
  cursor: pointer;
  border: none;
  &:hover {
    transform: scale(1.1);
  }
  transition: transform 0.2s ease-in-out;
`;

const PopupImg = styled.img`
  width: ${(props) => props.$width};
  margin-right: ${(props) => props.$mr};
`;

const Header = ({ isReviewVisible }) => {
  const naviagate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [userImg, setUserImg] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const isMobile = useMediaQuery({
    query: "(max-width:767px)",
  });
  const handlePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };
  const onClickLogo = () => {
    naviagate("/");
  };

  const onClickLoginText = () => {
    naviagate("/login");
  };

  const onClickMypage = () => {
    naviagate("/mypage");
  };

  const userInfoGet = async () => {
    const url = "http://localhost:8080/api/v1/member/user-info";

    const headers = {
      Authorization:
        "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhYmNAZ21haWwuY29tIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTc1MDczNDUxOX0.ijKYuqhCowJpjNI7QEgOWOpcFzqhTkC2jFMvi4UfUtacDTxfzHaNgvXdsZB3iyO6JBScKe53ctzKgcYIXfFHgA",
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error("사용자 정보 조회 GET:", error);
    }
  };
  useEffect(() => {
    const InfoGet = async () => {
      const res = await userInfoGet();
      setNickname(res.data.nickname);
      setUserImg(res.data.profileImage);
      console.log(res);
    };

    InfoGet();
  }, []);
  return (
    <>
      <HeaderContainer $ismobile={isMobile} $isReviewVisible={isReviewVisible}>
        {isReviewVisible ? (
          <Logo
            src={logoImgDark}
            alt="로고이미지"
            $ismobile={isMobile}
            onClick={onClickLogo}
          />
        ) : (
          <Logo
            src={logoImgWhite}
            alt="로고이미지"
            $ismobile={isMobile}
            onClick={onClickLogo}
          />
        )}

        <UserInfoContainer>
          {nickname === "" ? (
            <LoginBtn
              $ismobile={isMobile}
              $isReviewVisible={isReviewVisible}
              onClick={onClickLoginText}
            >
              로그인하러 가기
            </LoginBtn>
          ) : (
            <>
              <HeaderText
                $ismobile={isMobile}
                $isReviewVisible={isReviewVisible}
              >
                {nickname}님, 환영합니다.
              </HeaderText>
              <UserImageContainer
                $ismobile={isMobile}
                $image={userImg ? profileImage : profileIcon}
                onClick={handlePopup}
              />
            </>
          )}
        </UserInfoContainer>
      </HeaderContainer>
      {isPopupOpen ? (
        <Popup $ismobile={isMobile}>
          <PopupBtn>
            <PopupImg src={profileIcon} $width="20px" $mr="5px" />
            마이페이지
          </PopupBtn>
          <PopupBtn>
            <PopupImg src={LogoutIcon} $width="15px" $mr="10px" />
            로그아웃
          </PopupBtn>
        </Popup>
      ) : null}
    </>
  );
};

export default Header;
