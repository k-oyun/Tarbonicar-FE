import { useEffect, useState } from "react";
import styled from "styled-components";
import logoImg from "../assets/imgs/Logo.png";
import sahuruImg from "../assets/imgs/Sahuru.png";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #d9d9d9;
  background-color: transparent;
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
`;

const Logo = styled.img`
  width: 100px;
  height: auto;
  margin-left: 30px;
`;

const Header = () => {
  const [nickname, setNickname] = useState("dsds");
  const [userImg, setUserImg] = useState("");

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
              <UserImageContainer $image={userImg} />
            </>
          )}
        </UserInfoContainer>
      </HeaderContainer>
    </>
  );
};

export default Header;
