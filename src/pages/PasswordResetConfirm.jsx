import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useSearchParams } from "react-router-dom";

import logoImgDark from "../assets/imgs/logoDark.png";
import passwordIcon from "../assets/imgs/passwordIcon.svg";
import memberApi from "../api/memberApi";
import ConfirmDialog from "../components/ConfirmDialog";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: ${(props) => (props.$isMobile ? "30px" : "24px")};
`;

const Box = styled.div`
  background-color: white;
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  border-radius: ${(props) => (props.$isMobile ? "0" : "8px")};
  box-shadow: ${(props) =>
    props.$isMobile ? "none" : "0 4px 10px rgba(0, 0, 0, 0.1)"};
  text-align: center;
`;

const Logo = styled.img`
  width: 120px;
  margin-bottom: 24px;
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 15px;
  margin-bottom: ${(props) => (props.$error ? "2px" : "10px")};
  background-color: #fff;

  &:hover {
    border-color: #7c7c7c;
  }
`;

const Password = styled.img`
  width: 15px;
  height: 15px;
  margin-right: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 0;
  border: none;
  font-size: 11px;

  &:focus {
    outline: none;
  }
`;

const ErrorText = styled.div`
  color: #e20000;
  font-size: 10px;
  margin: 2px 0 8px 4px;
  text-align: right;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${(props) => (props.disabled ? "#f2f2f2" : "#002c5f")};
  color: ${(props) => (props.disabled ? "#aaa" : "white")};
  font-weight: bold;
  font-size: 13px;
  border: none;
  border-radius: 5px;
  margin-bottom: 20px;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
`;

const PasswordResetConfirm = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
    const [searchParams] = useSearchParams();

    const [code, setCode] = useState("");
    const [isCodeValid, setIsCodeValid] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwError, setPwError] = useState("");
    const [confirmError, setConfirmError] = useState("");

    const [dialog, setDialog] = useState({ isOpen: false });

    // 이메일 코드 유효성 검사
    useEffect(() => {
        const codeParam = searchParams.get("code");
        if (!codeParam) {
            setDialog({
                isOpen: true,
                title: "오류",
                message: "올바르지 않은 접속입니다.",
                isRedButton: true,
                onConfirm: () => navigate("/"),
            });
            return;
        }
        setCode(codeParam);

        memberApi()
            .passwordResetEmailConfirm({ code: codeParam })
            .then(() => setIsCodeValid(true))
            .catch(() => {
                setDialog({
                    isOpen: true,
                    title: "오류",
                    message: "올바르지 않은 접속입니다.",
                    isRedButton: true,
                    onConfirm: () => navigate("/"),
                });
            });
    }, [searchParams, navigate]);

    const validatePassword = (pw) => {
        const trimmed = pw.trim();
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':",.<>?]).{8,}$/;
        return regex.test(trimmed);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!password.trim()) {
            setPwError("비밀번호를 입력해주세요.");
            return;
        }
        if (!validatePassword(password)) {
            setPwError("비밀번호는 대소문자·숫자·특수문자 포함 8자 이상이어야 합니다.");
            return;
        }
        if (!confirmPassword.trim()) {
            setConfirmError("비밀번호 확인을 입력해주세요.");
            return;
        }
        if (password !== confirmPassword) {
            setConfirmError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            await memberApi().passwordReset({
                code,
                newPassword: password.trim(),
            });
            setDialog({
                isOpen: true,
                title: "완료",
                message: "비밀번호가 정상적으로 변경되었습니다.",
                isRedButton: false,
                onConfirm: () => navigate("/login"),
            });
        } catch (err) {
            setDialog({
                isOpen: true,
                title: "오류",
                message: "요청 중 오류가 발생했습니다.",
                isRedButton: true,
                onConfirm: () => setDialog({ isOpen: false }),
            });
        }
    };

    if (!isCodeValid) {
        return (
            <Container $isMobile={isMobile}>
                <Box $isMobile={isMobile}>
                    <Logo src={logoImgDark} alt="로고 이미지" />
                </Box>
                <ConfirmDialog
                    isOpen={dialog.isOpen}
                    title={dialog.title}
                    message={dialog.message}
                    isRedButton={dialog.isRedButton}
                    onConfirm={dialog.onConfirm}
                />
            </Container>
        );
    }

    return (
        <Container $isMobile={isMobile}>
            <Box $isMobile={isMobile}>
                <Logo src={logoImgDark} alt="로고 이미지" />

                <form onSubmit={handleSubmit}>
                    <InputBox $error={!!pwError}>
                        <Password src={passwordIcon} alt="비밀번호 아이콘" />
                        <Input
                            type="password"
                            placeholder="새 비밀번호를 입력해주세요."
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (pwError) setPwError("");
                            }}
                            onBlur={() => {
                                if (!password.trim()) {
                                    setPwError("비밀번호를 입력해주세요.");
                                } else if (!validatePassword(password)) {
                                    setPwError(
                                        "비밀번호는 대소문자·숫자·특수문자 포함 8자 이상이어야 합니다."
                                    );
                                }
                            }}
                        />
                    </InputBox>
                    {pwError && <ErrorText>{pwError}</ErrorText>}

                    <InputBox $error={!!confirmError}>
                        <Password src={passwordIcon} alt="비밀번호 확인 아이콘" />
                        <Input
                            type="password"
                            placeholder="비밀번호를 한 번 더 입력해주세요."
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (confirmError) setConfirmError("");
                            }}
                            onBlur={() => {
                                if (!confirmPassword.trim()) {
                                    setConfirmError("비밀번호 확인을 입력해주세요.");
                                } else if (password !== confirmPassword) {
                                    setConfirmError("비밀번호가 일치하지 않습니다.");
                                }
                            }}
                        />
                    </InputBox>
                    {confirmError && <ErrorText>{confirmError}</ErrorText>}

                    <SubmitButton
                        type="submit"
                        disabled={!password.trim() || !confirmPassword.trim()}
                    >
                        비밀번호 변경
                    </SubmitButton>
                </form>
            </Box>

            <ConfirmDialog
                isOpen={dialog.isOpen}
                title={dialog.title}
                message={dialog.message}
                isRedButton={dialog.isRedButton}
                onConfirm={dialog.onConfirm}
                onCancel={dialog.onCancel || (() => setDialog({ isOpen: false }))}
            />
        </Container>
    );
};

export default PasswordResetConfirm;