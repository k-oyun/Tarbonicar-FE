import { useEffect, useState } from "react";
import styled from "styled-components";
import logoImgDark from "../assets/imgs/logoDark.png";
import logoImgWhite from "../assets/imgs/logoWhite.png";
import profileIcon from "../assets/imgs/profileIcon.png";
import LogoutIcon from "../assets/imgs/LogoutIcon.png";
import { fadeDown } from "../styles/animation";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import { memberApi } from "../api/memberApi";
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${(props) => (props.$ismobile ? "60px" : "80px")};
  border-bottom: ${(props) =>
    props.$isReviewVisible
      ? "1px solid #d9d9d9"
      : props.$border
      ? "1px solid #d9d9d9"
      : "none"};
  background-color: ${(props) =>
    props.$isReviewVisible
      ? "rgba(255, 255, 255, 0.95)"
      : props.$backgroundColor};
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
  color: ${(props) => (props.$isReviewVisible ? "black" : props.$textColor)};
`;

const LoginBtn = styled.button`
  width: auto;
  height: 30px;
  background-color: transparent;
  padding: 0px 5px;
  margin-right: 15px;
  font-size: ${(props) => (props.$ismobile ? "12px" : "14px")};
  border: none;
  color: ${(props) => (props.$isReviewVisible ? "black" : props.$textColor)};
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

const Header = ({
  isReviewVisible,
  backgroundColor,
  textColor,
  logoColor,
  border,
}) => {
  const naviagate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [userImg, setUserImg] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalConfirm, setIsModalConfirm] = useState(false);
  const { userInfoGet } = memberApi();
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
    naviagate("/my-page");
  };

  useEffect(() => {
    const InfoGet = async () => {
      const res = await userInfoGet();
      setNickname(res.data.data.nickname);
      setUserImg(res.data.data.profileImage);
    };

    InfoGet();
    const token = localStorage.getItem("accessToken");
    console.log("header", token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalConfirm) {
      naviagate("/");
      window.location.reload();
    }
  }, [isModalConfirm]);
  return (
    <>
      <HeaderContainer
        $ismobile={isMobile}
        $isReviewVisible={isReviewVisible}
        $backgroundColor={backgroundColor}
        $border={border}
      >
        {isReviewVisible ? (
          <Logo
            src={logoImgDark}
            alt="로고이미지"
            $ismobile={isMobile}
            onClick={onClickLogo}
          />
        ) : (
          <Logo
            src={logoColor === "white" ? logoImgWhite : logoImgDark}
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
              $textColor={textColor}
              onClick={onClickLoginText}
            >
              로그인하러 가기
            </LoginBtn>
          ) : (
            <>
              <HeaderText
                $ismobile={isMobile}
                $isReviewVisible={isReviewVisible}
                $textColor={textColor}
              >
                {nickname}님, 환영합니다.
              </HeaderText>
              <UserImageContainer
                $ismobile={isMobile}
                $image={userImg ? userImg : profileIcon}
                onClick={handlePopup}
              />
            </>
          )}
        </UserInfoContainer>
      </HeaderContainer>
      {isPopupOpen ? (
        <Popup $ismobile={isMobile}>
          <PopupBtn onClick={onClickMypage}>
            <PopupImg src={profileIcon} $width="20px" $mr="5px" />
            마이페이지
          </PopupBtn>
          <PopupBtn onClick={handleLogout}>
            <PopupImg src={LogoutIcon} $width="15px" $mr="10px" />
            로그아웃
          </PopupBtn>
        </Popup>
      ) : null}
      <ConfirmDialog
        isOpen={isModalOpen}
        title="로그아웃 되었습니다."
        // message="게시글이 성공적으로 등록되었습니다."
        onConfirm={() => {
          setIsModalOpen(false);
          setIsModalConfirm(true);
        }}
        showCancel={false}
        isRedButton={false}
      />
    </>
  );
};

export default Header;
