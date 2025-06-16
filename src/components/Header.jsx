import { useEffect, useState } from "react";
import styled from "styled-components";
import logoImg from "../assets/imgs/Logo.png";
import sahuruImg from "../assets/imgs/Sahuru.png";
import profileIcon from "../assets/imgs/profileIcon.png";
import LogoutIcon from "../assets/imgs/LogoutIcon.png";
import { fadeDown } from "../styles/animation";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #d9d9d9;
  background-color: transparent;
  position: fixed;
`;

const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UserImageContainer = styled.div`
  width: 45px;
  height: 45px;
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
  font-size: 14px;
  color: black;
`;

const LoginBtn = styled.button`
  width: auto;
  height: 30px;
  background-color: transparent;
  padding: 0px 5px;
  margin-right: 15px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
  transition: transform 0.2s ease-in-out;
`;

const Logo = styled.img`
  width: 100px;
  height: auto;
  margin-left: 30px;
`;

const Popup = styled.div`
  width: 150px;
  height: 120px;
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
  top: 70px;
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

const Header = () => {
  const [nickname, setNickname] = useState("dsds");
  const [userImg, setUserImg] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handlePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  useEffect(() => {
    setUserImg(sahuruImg);
  }, []);
  return (
    <>
      <HeaderContainer>
        <Logo src={logoImg} alt="로고이미지" />
        <UserInfoContainer>
          {nickname === "" ? (
            <LoginBtn>로그인하러 가기</LoginBtn>
          ) : (
            <>
              <HeaderText> {nickname}님, 환영합니다.</HeaderText>
              <UserImageContainer $image={userImg} onClick={handlePopup} />
            </>
          )}
        </UserInfoContainer>
      </HeaderContainer>
      {isPopupOpen ? (
        <Popup>
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
