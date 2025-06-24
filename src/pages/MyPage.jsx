import React, { useState, useEffect } from "react";
import styled from "styled-components";
import sahuruImg from "../assets/imgs/Sahuru.png";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import {
  updateNickname,
  updatePassword,
  updateProfileImage,
  deleteMember,
} from "../api/UpdateMemberInfo";
import ConfirmDialog from "../components/ConfirmDialog";
import axios from "../api/AxiosInstance";
import { useUser } from "../context/UserContext";
import profileIcon from "../assets/imgs/profileIcon.png";

const Container = styled.div`
  /* max-width: 900px; */
  margin: 0 auto;
  font-family: "Noto Sans KR", sans-serif;
  color: #333;
`;

const BreadCrumb = styled.div`
  font-size: 14px;
  color: #666;
  background-color: #e4dcd3;
  padding-bottom: 20px;
  padding-top: ${(props) => (props.$ismobile ? "80px" : "100px")};
  padding-left: 20px;
  a {
    color: #666;
    text-decoration: none;
    cursor: pointer;
  }
`;

const TitleSection = styled.section`
  background-color: #f1ede9;
  padding: 30px 0;
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 12px;
  color: #999;
  letter-spacing: 4px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${(props) => (props.$ismobile ? "column" : "row")};
  gap: ${(props) => (props.$ismobile ? "5px" : "20px")};
`;

const SideMenu = styled.div`
  display: flex;
  align-items: flex-start;
  width: ${(props) => (props.$ismobile ? "100%" : "180px")};
  justify-content: ${(props) => (props.$ismobile ? "space-around" : "")};
  box-shadow: ${(props) => (props.$ismobile ? "none" : "2px 2px 8px #eee")};
  flex-direction: ${(props) => (props.$ismobile ? "row" : "column")};
  margin-bottom: ${(props) => (props.$ismobile ? "0" : "130px")};
  margin-left: ${(props) => (props.$ismobile ? "0" : "30px")};
  border: ${(props) => (props.$ismobile ? "none" : "1px solid #ddd")};
  border-radius: 6px;
  background-color: white;
  padding: 0;
`;

const MenuItem = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})`
  width: ${(props) => (props.$ismobile ? "auto" : "80%")};
  height: ${(props) => (props.$ismobile ? "auto" : "60px")};
  text-align: ${(props) => (props.$ismobile ? "center" : "left")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  font-size: ${(props) => (props.$ismobile ? "13px" : "14px")};
  border-bottom: ${(props) => (props.$ismobile ? "none" : "1px solid #f6f3f2")};
  border: none;
  background-color: white;
  align-self: center;
  cursor: pointer;
  &:last-child {
    border-bottom: none;
    color: red;
  }
`;

const MainSection = styled.div`
  flex: 1;
  background-color: white;
  border: 1px none #ddd;
  border-radius: 6px;
  padding: 30px 40px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  width: 90%;
`;

const StatsBar = styled.div`
  background-color: #007fa8;
  color: white;
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
  margin-top: 5px;
  margin-bottom: 15px;
`;

const StatsItem = styled.div`
  cursor: pointer;
  font-size: ${(props) => (props.$ismobile ? "13px" : "14px")};
  font-weight: 600;
  text-align: left;
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
`;

const MyArticles = styled.div`
  font-size: ${(props) => (props.$ismobile ? "14px" : "15px")};
`;

const MyLikes = styled.div`
  font-size: ${(props) => (props.$ismobile ? "14px" : "15px")};
`;

const MyInquiries = styled.div`
  font-size: ${(props) => (props.$ismobile ? "14px" : "15px")};
`;

const ContentWrapper = styled.div`
  background-color: #f6f3f2;
  padding-top: 10px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ProfileSection = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ImageUploadWrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 100px;
  height: 100px;
  margin: 20px auto;
  cursor: pointer;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  width: 95%;
  height: 95%;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid transparent;
`;

const PlusIcon = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: white;
  color: #aaa;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 20px;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
`;

const HiddenInput = styled.input`
  display: none;
`;

const InfoLabel = styled.div`
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  margin: 10px 0 5px 30px;
`;

const SubText = styled.div`
  font-size: 10px;
  color: #878787;
  text-align: left;
  margin: 0 0 -5px 30px;
  font-weight: 600;
`;

const BorderLine = styled.hr`
  border: none;
  border-top: 1px solid #cccccc;
  margin: 20px 0;
  width: 95%;
  align-self: center;
`;

const InputRow = styled.div`
  gap: 10px;
  margin: 30px;
`;

const InputLabel = styled.label`
  font-size: 14px;
  color: #333;
  min-width: 60px;
  font-weight: bold;
`;

const InputField = styled.input`
  padding: 5px;
  width: 40%;
  margin: 10px 0;
  font-size: 14px;
  border: 2px solid #ddd;
  margin-right: ${(props) => (props.$withRightMargin ? "32px" : "")};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: right;
  gap: 10px;
  margin: 10px 20px;
  margin-top: auto;
`;

const CancelButton = styled.div`
  background-color: white;
  color: #333;
  padding: 10px 20px;
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.16);
`;

const ActionButton = styled.div`
  background-color: #002c5f;
  color: white;
  padding: 10px 20px;
  font-size: 14px;
  margin-top: 10px;
  border: none;
  cursor: pointer;
`;

// const SideMenu = styled.div``;
const MyPage = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userImg, setUserImg] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("프로필");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const isMobile = useMediaQuery({
    query: "(max-width:767px)",
  });

  useEffect(() => {
    console.log(isMobile);
  }, [isMobile]);

  const handleNicknameChange = async () => {
    try {
      await updateNickname(nickname); // 서버에 닉네임 업데이트
      setUser((prev) => ({ ...prev, nickname })); // Context 업데이트 → Header 자동 반영
      alert("닉네임이 변경되었습니다.");
      navigate(0);
    } catch (e) {
      alert("닉네임 변경 실패");
    }
  };
  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      alert("비밀번호 그거 아닌데? 아닌데? 아닌데? 아닌데? 응 아니야~");
      navigate(0);
      return;
    }
    try {
      await updatePassword(password, confirmPassword);
      alert("비밀번호가 변경되었습니다.");
      navigate(0);
    } catch (e) {
      alert("비밀번호 변경 중 오류 발생");
    }
  };

  const handleImageChange = async () => {
    if (!selectedFile) {
      alert("이미지를 먼저 선택해주세요.");
      return;
    }

    try {
      const imageUrl = await updateProfileImage(selectedFile); // 서버 업로드
      setUserImg(imageUrl); // 미리보기 이미지 업데이트
      setUser((prev) => ({ ...prev, profileImage: imageUrl })); // Context도 반영
      alert("프로필 이미지가 변경되었습니다.");
      setSelectedFile(null); // 상태 초기화
      navigate(0);
    } catch (err) {
      alert("이미지 변경 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMember();
      alert("회원 탈퇴가 완료되었습니다.");
      localStorage.removeItem("accessToken"); // 토큰 삭제
      navigate("/"); // 홈 또는 로그인 페이지로 이동
    } catch (e) {
      console.error("회원 탈퇴 실패:", e);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const renderMainContent = () => {
    switch (selectedMenu) {
      case "프로필":
        return (
          <>
            <ProfileSection>
              <InfoLabel>내 정보 수정</InfoLabel>
              <SubText>등록한 계정 정보를 수정하실 수 있습니다.</SubText>
              <BorderLine />
              <ImageUploadWrapper>
                <ProfileImage
                  src={
                    userImg && userImg !== "null" && userImg.trim() !== ""
                      ? userImg
                      : user.profileImage &&
                        user.profileImage !== "null" &&
                        user.profileImage.trim() !== ""
                      ? user.profileImage
                      : profileIcon
                  }
                  alt="프로필 이미지"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = profileIcon;
                  }}
                />
                <PlusIcon>+</PlusIcon>
                <HiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedFile(file); // ✅ 여기서만 저장
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setUserImg(reader.result); // 즉시 미리보기만
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </ImageUploadWrapper>
              <ButtonGroup>
                <CancelButton>취소</CancelButton>
                <ActionButton onClick={handleImageChange}>변경</ActionButton>
              </ButtonGroup>
            </ProfileSection>
          </>
        );
      case "닉네임":
        return (
          <>
            <ProfileSection>
              <InfoLabel>내 정보 수정</InfoLabel>
              <SubText>등록한 계정 정보를 수정하실 수 있습니다.</SubText>
              <BorderLine />
              <InputRow>
                <InputLabel htmlFor="nickname">닉네임: </InputLabel>
                <InputField
                  $ismobile={isMobile}
                  id="nickname"
                  onChange={(e) => setNickname(e.target.value)}
                />
              </InputRow>
              <ButtonGroup>
                <CancelButton>취소</CancelButton>
                <ActionButton onClick={handleNicknameChange}>변경</ActionButton>
              </ButtonGroup>
            </ProfileSection>
          </>
        );
      case "비밀번호":
        return (
          <>
            <ProfileSection>
              <InfoLabel>내 정보 수정</InfoLabel>
              <SubText>등록한 계정 정보를 수정하실 수 있습니다.</SubText>
              <BorderLine />
              <InputRow>
                <InputLabel htmlFor="password">비밀번호: </InputLabel>
                <InputField
                  $ismobile={isMobile}
                  id="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <InputLabel htmlFor="confirmPassword">
                  비밀번호 확인:{" "}
                </InputLabel>
                <InputField
                  $ismobile={isMobile}
                  $withRightMargin
                  id="confirmPassword"
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </InputRow>
              <ButtonGroup>
                <CancelButton>취소</CancelButton>
                <ActionButton onClick={handlePasswordChange}>변경</ActionButton>
              </ButtonGroup>
            </ProfileSection>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Container $ismobile={isMobile}>
        <BreadCrumb $ismobile={isMobile}>
          홈 &gt; <a href="/my-page">마이페이지</a>
        </BreadCrumb>
        <TitleSection>
          <Title>마이페이지</Title>
          <Subtitle>이용 중인 타보니까를 어쩌구 저쩌구 ㄴㅇㅁㅇㄴ</Subtitle>
        </TitleSection>
        <Content $ismobile={isMobile}>
          <SideMenu $ismobile={isMobile}>
            <MenuItem
              $ismobile={isMobile}
              active={selectedMenu === "프로필"}
              onClick={() => setSelectedMenu("프로필")}
            >
              프로필 사진 수정
            </MenuItem>
            <MenuItem
              $ismobile={isMobile}
              active={selectedMenu === "닉네임"}
              onClick={() => setSelectedMenu("닉네임")}
            >
              닉네임 수정
            </MenuItem>
            <MenuItem
              $ismobile={isMobile}
              active={selectedMenu === "비밀번호"}
              onClick={() => setSelectedMenu("비밀번호")}
            >
              비밀번호 수정
            </MenuItem>
            <ConfirmDialog
              isOpen={isModalOpen}
              title="회원 탈퇴 하시겠습니까?"
              message="회원 탈퇴 할 경우 작성한 게시판 내용은 복구할 수 없습니다."
              onCancel={() => setIsModalOpen(false)}
              onConfirm={handleDelete}
              isRedButton={true}
            />
            <MenuItem $ismobile={isMobile} onClick={() => setIsModalOpen(true)}>
              회원탈퇴
            </MenuItem>
          </SideMenu>
          <MainSection>
            <h3>
              <strong>{user.nickname}</strong>님, 안녕하세요!
            </h3>
            <StatsBar>
              <StatsItem
                onClick={() => navigate("/my-article")}
                $ismobile={isMobile}
              >
                <span>내가 작성한 글 &gt;</span>
                <MyArticles $ismobile={isMobile}>23개</MyArticles>
              </StatsItem>
              <StatsItem $ismobile={isMobile}>
                <span>받은 좋아요 수 &gt;</span>
                <MyLikes $ismobile={isMobile}>99개</MyLikes>
              </StatsItem>
              <StatsItem $ismobile={isMobile}>
                <span>1:1 문의 내역 &gt;</span>
                <MyInquiries $ismobile={isMobile}>25개</MyInquiries>
              </StatsItem>
            </StatsBar>
            <ContentWrapper>{renderMainContent()}</ContentWrapper>
          </MainSection>
        </Content>
      </Container>
    </>
  );
};

export default MyPage;
