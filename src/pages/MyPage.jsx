import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import {
  updateNickname,
  updatePassword,
  updateProfileImage,
  deleteMember,
} from "../api/UpdateMemberInfo";
import ConfirmDialog from "../components/ConfirmDialog";
import profileIcon from "../assets/imgs/profileIcon.png";
import { articleApi } from "../api/articleApi";
import { memberApi } from "../api/memberApi";
import passwordEyeIcon from "../assets/imgs/passwordEye.svg";
import passwordEyeCloseIcon from "../assets/imgs/passwordEye2.svg";

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
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};
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

const PasswordInputFieldWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 40%;
  margin-top: 10px;
  margin-right: ${(props) => (props.$withRightMargin ? "32px" : "")};
`;

const InputField = styled.input`
  padding: 5px;
  width: 40%;
  margin: 10px 0;
  font-size: 14px;
  border: 2px solid #ddd;
  margin-right: ${(props) => (props.$withRightMargin ? "32px" : "")};
`;

const PasswordInputField = styled.input`
  padding: 5px 30px 5px 5px;
  width: 100%;
  font-size: 14px;
  border: 2px solid #ddd;
  box-sizing: border-box;
`;
const EyeIcon = styled.img`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
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
  margin-bottom: 7px;
  margin-right: 5px;
  border: none;
  cursor: pointer;
`;

// const SideMenu = styled.div``;
const MyPage = () => {
  const [userInfo, setUserInfo] = useState({
    nickname: "",
    profileImage: "",
  });
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userImg, setUserImg] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("프로필");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState("");
  const [infoReload, setInfoReload] = useState(false);
  const navigate = useNavigate();
  const { getMyArticleCountApi, getMyTotalLikeCountApi } = articleApi();
  const { userInfoGet } = memberApi();
  const [myArticleCount, setMyArticleCount] = useState(0);
  const [myLikeCount, setMyLikeCount] = useState(0);

  const nicknamePattern = /^.{2,20}$/;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const isMobile = useMediaQuery({
    query: "(max-width:767px)",
  });

  useEffect(() => {
    const infoGet = async () => {
      const resUser = await userInfoGet();
      setUserInfo(resUser.data.data);
      console.log(resUser);
      const resMypage1 = await getMyArticleCountApi();
      setMyArticleCount(resMypage1.data.data);
      console.log(resMypage1);
      const likeRes = await getMyTotalLikeCountApi();
      setMyLikeCount(likeRes.data.data);
    };

    infoGet();
  }, []);

  useEffect(() => {
    console.log(isMobile);
  }, [isMobile]);

  // 닉네임 변경
  const handleNicknameChange = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setInfoModalMessage("닉네임을 입력해주세요.");
      setInfoReload(false);
      setInfoModalOpen(true);
      return;
    }
    if (!nicknamePattern.test(trimmed)) {
      setInfoModalMessage("닉네임은 2~20자 사이로 입력해주세요.");
      setInfoReload(false);
      setInfoModalOpen(true);
      return;
    }

    try {
      await updateNickname(nickname.trim());
      setUserInfo((u) => ({ ...u, nickname: nickname.trim() }));
      setInfoModalMessage("닉네임이 변경되었습니다.");
      setInfoReload(true);
    } catch (e) {
      console.error(e);
      setInfoModalMessage("닉네임 변경에 실패했습니다.");
      setInfoReload(false);
    } finally {
      setInfoModalOpen(true);
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = async () => {
    if (!password.trim()) {
      setInfoModalMessage("비밀번호를 입력해주세요.");
      setInfoReload(false);
      setInfoModalOpen(true);
      return;
    }
    if (!confirmPassword.trim()) {
      setInfoModalMessage("비밀번호 확인을 입력해주세요.");
      setInfoReload(false);
      setInfoModalOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setInfoModalMessage(
        "입력하신 비밀번호가 일치하지 않습니다. 다시 확인해주세요."
      );
      setPassword("");
      setConfirmPassword("");
      setInfoReload(false);
      setInfoModalOpen(true);
      return;
    }

    if (!passwordPattern.test(password)) {
      setInfoModalMessage(
        "비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해 8자 이상이어야 합니다."
      );
      setPassword("");
      setConfirmPassword("");
      setInfoReload(false);
      setInfoModalOpen(true);
      return;
    }

    try {
      await updatePassword(password, confirmPassword);
      setInfoModalMessage("비밀번호가 변경되었습니다.");
      setInfoReload(true);
    } catch (e) {
      console.error(e);
      setInfoModalMessage("비밀번호 변경 중 오류가 발생했습니다.");
      setInfoReload(false);
    }
    setInfoModalOpen(true);
  };

  // 이미지 변경
  const handleImageChange = async () => {
    if (!selectedFile) {
      setInfoModalMessage("업로드할 프로필 사진을 선택해주세요.");
      setInfoReload(false);
      setInfoModalOpen(true);
      return;
    }

    // 파일 형식 검사
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(selectedFile.type)) {
      setInfoModalMessage("이미지는 JPG, JPEG, PNG 형식만 업로드 가능합니다.");
      setInfoReload(false);
      setInfoModalOpen(true);
      setSelectedFile(null);
      return;
    }

    // 파일 크기 검사 (5MB 이하)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setInfoModalMessage("이미지는 5MB 이하만 업로드 가능합니다.");
      setInfoReload(false);
      setInfoModalOpen(true);
      setSelectedFile(null);
      return;
    }

    try {
      const imageUrl = await updateProfileImage(selectedFile); // 이미지 업로드
      setUserImg(imageUrl); // 미리보기 이미지 업데이트
      // setUserInfo((prev) => ({ ...prev, profileImage: imageUrl })); // Context도 반영
      setInfoModalMessage("프로필 이미지가 변경되었습니다.");
      setInfoReload(true);
      setSelectedFile(null); // 상태 초기화
    } catch (e) {
      console.log(e);
      setInfoModalMessage("프로필 이미지 변경 중 오류가 발생했습니다.");
      setInfoReload(false);
    }
    setInfoModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteMember();
      setInfoModalMessage("회원 탈퇴가 완료되었습니다.");
      setInfoReload(false);
      localStorage.removeItem("accessToken"); // 토큰 삭제
      navigate("/"); // 홈 또는 로그인 페이지로 이동
    } catch (e) {
      console.error("회원 탈퇴 실패:", e);
      setInfoModalMessage("회원 탈퇴 중 오류가 발생했습니다.");
      setInfoReload(false);
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
                      : userInfo.profileImage &&
                        userInfo.profileImage !== "null" &&
                        userInfo.profileImage.trim() !== ""
                      ? userInfo.profileImage
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
                      setSelectedFile(file); // 여기서만 저장
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
                {/* <CancelButton>취소</CancelButton> */}
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
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </InputRow>
              <ButtonGroup>
                {/* <CancelButton>취소</CancelButton> */}
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
                <PasswordInputFieldWrapper>
                  <PasswordInputField
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <EyeIcon
                    src={showPassword ? passwordEyeIcon : passwordEyeCloseIcon}
                    onClick={() => setShowPassword((prev) => !prev)}
                    alt="toggle password visibility"
                  />
                </PasswordInputFieldWrapper>
                <br></br>
                <InputLabel htmlFor="confirmPassword">
                  비밀번호 확인:{" "}
                </InputLabel>
                <PasswordInputFieldWrapper $withRightMargin>
                  <PasswordInputField
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <EyeIcon
                    src={
                      showConfirmPassword
                        ? passwordEyeIcon
                        : passwordEyeCloseIcon
                    }
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    alt="toggle confirm password visibility"
                  />
                </PasswordInputFieldWrapper>
              </InputRow>
              <ButtonGroup>
                {/* <CancelButton>취소</CancelButton> */}
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
          <Subtitle>
            타보니까의 등록된 회원님의 정보를 수정할 수 있습니다.
          </Subtitle>
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
              <strong>{userInfo.nickname}</strong>님, 안녕하세요!
            </h3>
            <StatsBar>
              <StatsItem
                onClick={() => navigate("/my-article")}
                $ismobile={isMobile}
              >
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/my-article")}
                >
                  내가 작성한 글 &gt;
                </span>
                <MyArticles $ismobile={isMobile}>{myArticleCount}개</MyArticles>
              </StatsItem>
              <StatsItem $ismobile={isMobile}>
                <span>받은 좋아요 수 &gt;</span>
                <MyLikes $ismobile={isMobile}>{myLikeCount}개</MyLikes>
              </StatsItem>
              <StatsItem $ismobile={isMobile}>
                <span>1:1 문의 내역 &gt;</span>
                <MyInquiries $ismobile={isMobile}>0개</MyInquiries>
              </StatsItem>
            </StatsBar>
            <ContentWrapper>{renderMainContent()}</ContentWrapper>
          </MainSection>
        </Content>
        <ConfirmDialog
          isOpen={infoModalOpen}
          title="알림"
          message={infoModalMessage}
          cancelText=""
          confirmText="확인"
          showCancel={false}
          onConfirm={() => {
            setInfoModalOpen(false);
            if (infoReload) {
              navigate(0);
            }
          }}
        />
      </Container>
    </>
  );
};

export default MyPage;
