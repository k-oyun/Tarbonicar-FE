import styled from "styled-components";
import logoImgDark from "../assets/imgs/logoDark.png";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
const HeaderContainer = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(props) => (props.$ismobile ? "60px" : "80px")};
  border-bottom: "1px solid #d9d9d9";
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  transition: background-color 0.3s ease, border-bottom 0.3s ease;
  position: fixed;
  top: 0;
  z-index: 3000;
`;

const Logo = styled.img`
  width: ${(props) => (props.$ismobile ? "60px" : "100px")};
  margin-left: 30px;
  cursor: pointer;
`;
const RegisterHeader = () => {
  const naviagate = useNavigate();
  const isMobile = useMediaQuery({
    query: "(max-width:767px)",
  });

  const onClickLogo = () => {
    naviagate("/");
  };
  return (
    <HeaderContainer $ismobile={isMobile}>
      <Logo
        src={logoImgDark}
        alt="로고이미지"
        $ismobile={isMobile}
        onClick={onClickLogo}
      />
    </HeaderContainer>
  );
};

export default RegisterHeader;
