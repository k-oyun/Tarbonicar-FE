import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import checkIcon from "../assets/imgs/check2.svg";
import passwordEyeIcon from "../assets/imgs/passwordEye.svg";
import passwordEyeCloseIcon from "../assets/imgs/passwordEye2.svg";
import memberApi from "../api/memberApi";
import { useNavigate } from "react-router-dom";
import { imageUploadApi } from "../api/imageUploadApi";
import ConfirmDialog from "../components/ConfirmDialog";

const PageWrapper = styled.div`
  padding: ${(props) =>
    props.$isMobile ? "50px 12px 20px" : "80px 40px 40px"};
`;

// 페이지 제목
const Title = styled.h2`
  color: #444;
  text-align: center;
  margin: ${(props) => (props.$isMobile ? "15px 0 30px" : "35px")};
  font-size: ${(props) => (props.$isMobile ? "20px" : "25px")};
  font-weight: bold;
`;

// 입력 영역
const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 ${(props) => (props.$isMobile ? "12px" : "0")};
`;

// 각 스텝: 번호와 내용 나란히 정렬
const StepItem = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  transition: margin 0.3s ease;
`;

// 번호랑 원 표시
const StepCircleWrapper = styled.div`
  width: 24px;
  text-align: center;
  font-weight: bold;
  font-size: 13px;
  flex-shrink: 0;
`;

// 작대기
const StepLine = styled.div`
  width: 1px;
  height: ${(props) => (props.$isPast ? "20px" : "60px")};
  background-color: ${(props) => (props.$isPast ? "#002c5f" : "#ccc")};
  margin: 10px auto;
  transition: height 0.3s ease;
`;

// 번호 표시
const StepNumber = styled.div`
  width: ${(props) => (props.$isCurrent ? "24px" : "auto")};
  height: ${(props) => (props.$isCurrent ? "24px" : "auto")};
  border-radius: ${(props) => (props.$isCurrent ? "50%" : "none")};
  background-color: ${(props) =>
    props.$isCurrent ? "#002c5f" : "transparent"};
  color: ${(props) =>
    props.$isCurrent ? "white" : props.$isPast ? "#002c5f" : "#aaa"};
  font-size: 13px;
  font-weight: ${(props) => (props.$isPast ? "bold" : "normal")};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

// 단게마다 텍스트
const StepTitle = styled.div`
  color: ${(props) =>
    props.$isActive || props.$isDone ? "#002c5f" : "#7c7c7c"};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${(props) => (props.$isMobile ? "13px" : "16px")};
`;

// 체크 아이콘
const CheckIcon = styled.img`
  width: 15px;
  height: 15px;
`;

// 입력창
const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  font-size: 13px;
  padding-right: 35px;
  border: 1px solid #ccc;
`;

// 이메일 입력창, 중복확인 버튼 나란히 가로 정렬
const InputRow = styled.div`
  display: flex;
  width: 100%;
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 13px;
  border: 1px solid #ccc;
  border-right: none;
`;

const CheckButton = styled.button`
  height: 40px;
  padding: ${(props) => (props.$isMobile ? "6px 10px" : "0px 16px")};
  font-size: ${(props) => (props.$isMobile ? "12px" : "14px")};
  background-color: #002c5f;
  color: white;
  font-weight: bold;
  border: 1px solid #002c5f;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background-color: #001e3e;
  }
`;

// 에러 메시지
const ErrorMsg = styled.div`
  color: #e20000;
  font-size: 12px;
  margin-top: 4px;
  text-align: right;
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const PreviewImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  background-color: #eee;
`;

// 파일 업로드 버튼
const UploadButton = styled.label`
  padding: ${(props) => (props.$isMobile ? "5px 16px" : "7px 30px")};
  font-size: ${(props) => (props.$isMobile ? "8px" : "10px")};
  background-color: #002c5f;
  color: white;
  cursor: pointer;
  display: inline-block;
  &:hover {
    background-color: #001e3e;
  }
`;

// 최종 제출 버튼
const SubmitButton = styled.button`
  padding: ${(props) => (props.$isMobile ? "6px 20px" : "8px 40px")};
  font-size: ${(props) => (props.$isMobile ? "10px" : "13px")};
  background-color: #002c5f;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  margin: 40px auto 0;
  display: block;

  &:hover {
    background-color: #001e3e;
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
`;

const PasswordInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 10px 35px 10px 10px;
  font-size: 13px;
  border: 1px solid #ccc;
  box-sizing: border-box;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Signup = () => {
  const isMobile = useMediaQuery({ query: "(max-width:767px)" });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const { postImageUploadApi } = imageUploadApi();
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const [dialog, setDialog] = useState({ isOpen: false });
  const inputRefs = useRef([]);

  const moveToNextStep = (nextStep) => {
    setCurrentStep(nextStep);
    requestAnimationFrame(() => {
      inputRefs.current[nextStep - 1]?.focus();
    });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailValid(isValid);

    if (!isValid) {
      setEmailError("올바른 이메일 형식을 입력해주세요.");
    } else {
      setEmailError("");
    }
  };

  const handleEmailCheck = async () => {
    if (!emailValid) {
      setEmailError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    try {
      const res = await memberApi().checkEmail(email);
      const isDuplicate = res.data.data;

      if (isDuplicate) {
        setEmailError("이미 사용 중인 이메일입니다.");
      } else {
        setEmailError("");
        moveToNextStep(2);
      }
    } catch (err) {
      console.error(err);
      setEmailError("이메일 확인 중 오류가 발생했습니다.");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':",.<>?]).{8,}$/;

    if (!regex.test(value)) {
      setPasswordValid(false);
      setPasswordError("");
      setPasswordError(
        "비밀번호는 대소문자, 숫자, 특수문자 포함 8자 이상이어야 합니다."
      );
    } else {
      setPasswordValid(true);
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordsMatch(value === password);
  };

  const handleNicknameChange = (e) => {
    const value = e.target.value.trim();
    setNickname(value);

    if (value.length < 2 || value.length > 20) {
      setNicknameError("닉네임은 2~20자 이내여야 합니다.");
    } else {
      setNicknameError("");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setDialog({
          isOpen: true,
          title: "이미지는 jpg, jpeg, png 형식만 가능합니다.",
          showCancel: false,
          isRedButton: true,
          onConfirm: () => setDialog({ isOpen: false }),
          onCancel: () => {},
        });
        return;
      }

      if (file.size > maxSize) {
        setDialog({
          isOpen: true,
          title: "이미지 용량은 5MB 이하만 가능합니다.",
          showCancel: false,
          isRedButton: true,
          onConfirm: () => setDialog({ isOpen: false }),
          onCancel: () => {},
        });
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await postImageUploadApi(formData);
        const url = res.data.data;
        setUploadedImageUrl(url);
        setProfileImage(URL.createObjectURL(file));
      } catch {
        setDialog({
          isOpen: true,
          title: "이미지 업로드 실패",
          showCancel: false,
          isRedButton: true,
          onConfirm: () => setDialog({ isOpen: false }),
          onCancel: () => {},
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = uploadedImageUrl;
      if (!imageUrl && fileInputRef.current?.files?.[0]) {
        const formData = new FormData();
        formData.append("image", fileInputRef.current.files[0]);

        const res = await imageUploadApi().postImageUploadApi(formData);
        imageUrl = res.data.data;
      }

      await memberApi().signup({
        email: email.trim(),
        password: password.trim(),
        checkedPassword: password.trim(),
        nickname: nickname.trim(),
        profileImage: imageUrl,
      });

      setDialog({
        isOpen: true,
        title: "회원가입이 완료되었습니다.",
        showCancel: false,
        isRedButton: false,
        onConfirm: () => {
          setDialog({ isOpen: false });
          navigate("/login");
        },
        onCancel: () => setDialog({ isOpen: false }),
      });
    } catch (err) {
      setDialog({
        isOpen: true,
        title: "회원가입 실패",
        message: err.response?.data?.message || err.message,
        showCancel: false,
        isRedButton: true,
        onConfirm: () => setDialog({ isOpen: false }),
        onCancel: () => {},
      });
    }
  };

  return (
    <PageWrapper>
      <Title $isMobile={isMobile}>회원가입</Title>
      <StepWrapper $isMobile={isMobile}>
        {[1, 2, 3, 4, 5].map((step) => (
          <StepItem key={step} $isPast={currentStep > step}>
            <StepCircleWrapper>
              <StepNumber
                $isCurrent={step === currentStep}
                $isPast={step < currentStep}
              >
                {step}
              </StepNumber>
              {step < 5 && <StepLine $isPast={currentStep > step} />}
            </StepCircleWrapper>

            <StepContent>
              <StepTitle
                $isActive={currentStep === step}
                $isDone={currentStep > step}
                $isMobile={isMobile}
              >
                {step === 1 && "이메일 입력"}
                {step === 2 && "비밀번호 입력"}
                {step === 3 && "비밀번호 확인"}
                {step === 4 && "닉네임 입력"}
                {step === 5 && "프로필 사진 등록"}
                {currentStep > step && <CheckIcon src={checkIcon} alt="완료" />}
              </StepTitle>

              {step === 1 && currentStep === 1 && (
                <>
                  <InputRow>
                    <EmailInput
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      ref={(el) => (inputRefs.current[0] = el)}
                    />
                    <CheckButton
                      $isMobile={isMobile}
                      onClick={handleEmailCheck}
                    >
                      중복 확인
                    </CheckButton>
                  </InputRow>
                  {emailError && <ErrorMsg>{emailError}</ErrorMsg>}
                </>
              )}
              {step === 2 && currentStep === 2 && (
                <>
                  <InputRow>
                    <PasswordInputWrapper>
                      <PasswordInput
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        ref={(el) => (inputRefs.current[1] = el)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && passwordValid) {
                            moveToNextStep(3);
                          }
                        }}
                      />
                      <ToggleButton
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <img
                          src={
                            showPassword
                              ? passwordEyeIcon
                              : passwordEyeCloseIcon
                          }
                          alt="비밀번호 보기 전환"
                          style={{ width: "16px", height: "16px" }}
                        />
                      </ToggleButton>
                    </PasswordInputWrapper>
                    <CheckButton
                      $isMobile={isMobile}
                      onClick={() => {
                        if (passwordValid) moveToNextStep(3);
                      }}
                    >
                      다음
                    </CheckButton>
                  </InputRow>

                  {passwordError && <ErrorMsg>{passwordError}</ErrorMsg>}
                </>
              )}
              {step === 3 && currentStep === 3 && (
                <>
                  <InputRow>
                    <PasswordInputWrapper>
                      <PasswordInput
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        ref={(el) => (inputRefs.current[2] = el)}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            confirmPassword === password
                          ) {
                            moveToNextStep(4);
                          }
                        }}
                      />
                      <ToggleButton
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <img
                          src={
                            showPassword
                              ? passwordEyeIcon
                              : passwordEyeCloseIcon
                          }
                          alt="비밀번호 보기 전환"
                          style={{ width: "16px", height: "16px" }}
                        />
                      </ToggleButton>
                    </PasswordInputWrapper>
                    <CheckButton
                      $isMobile={isMobile}
                      onClick={() => {
                        if (confirmPassword === password) moveToNextStep(4);
                      }}
                    >
                      다음
                    </CheckButton>
                  </InputRow>

                  {!passwordsMatch && confirmPassword && (
                    <ErrorMsg>비밀번호가 일치하지 않습니다.</ErrorMsg>
                  )}
                </>
              )}
              {step === 4 && currentStep === 4 && (
                <>
                  <InputRow>
                    <Input
                      type="text"
                      value={nickname}
                      onChange={handleNicknameChange}
                      ref={(el) => (inputRefs.current[3] = el)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && nickname.length >= 2) {
                          moveToNextStep(5);
                        }
                      }}
                    />
                    <CheckButton
                      $isMobile={isMobile}
                      onClick={() => {
                        if (nickname.length >= 2) moveToNextStep(5);
                      }}
                    >
                      다음
                    </CheckButton>
                  </InputRow>
                  {nicknameError && <ErrorMsg>{nicknameError}</ErrorMsg>}
                </>
              )}
              {step === 5 && currentStep === 5 && (
                <>
                  <HiddenInput
                    type="file"
                    accept="image/*"
                    id="profile-upload"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <UploadWrapper>
                    <UploadButton htmlFor="profile-upload" $isMobile={isMobile}>
                      이미지 첨부
                    </UploadButton>
                    {profileImage ? (
                      <PreviewImage src={profileImage} alt="미리보기" />
                    ) : (
                      <PreviewImage style={{ visibility: "hidden" }} />
                    )}
                  </UploadWrapper>
                </>
              )}
            </StepContent>
          </StepItem>
        ))}
      </StepWrapper>
      {currentStep === 5 && (
        <SubmitButton $isMobile={isMobile} onClick={handleSubmit}>
          회원가입
        </SubmitButton>
      )}

      <ConfirmDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        showCancel={dialog.showCancel}
        isRedButton={dialog.isRedButton}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel}
      />
    </PageWrapper>
  );
};

export default Signup;
