import React, { useState } from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

import logoImgDark from "../assets/imgs/logoDark.png";
import emailIcon from "../assets/imgs/emailIcon.svg";
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

const Email = styled.img`
    width: 17px;
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

const BottomText = styled.div`
    font-size: 12px;
    color: #333;
    text-decoration: underline;
    cursor: pointer;
`;

const PasswordResetRequest = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [dialog, setDialog] = useState({ isOpen: false });

    const validateEmail = (email) => {
        const trimmed = email.trim();
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(trimmed);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setEmailError("이메일을 입력해주세요.");
            return;
        }
        if (!validateEmail(email)) {
            setEmailError("올바른 이메일 형식을 입력해주세요.");
            return;
        }

        setIsLoading(true);
        try {
            await memberApi().passwordResetEmailRequest({ email: email.trim() });
            setDialog({
                isOpen: true,
                title: "비밀번호 재설정",
                message: "비밀번호 초기화 링크가 등록된 이메일로 발송되었습니다.",
                isRedButton: false,
                onConfirm: () => setDialog({ isOpen: false }),
            });
        } catch (err) {
            const status = err.response?.status;
            if (status === 400 || status === 404) {
                setDialog({
                    isOpen: true,
                    title: "오류",
                    message: "등록되지 않은 계정 또는 잘못된 이메일을 입력하셨습니다.",
                    isRedButton: true,
                    onConfirm: () => setDialog({ isOpen: false }),
                });
            } else {
                setDialog({
                    isOpen: true,
                    title: "오류",
                    message: "요청 중 오류가 발생했습니다.",
                    isRedButton: true,
                    onConfirm: () => setDialog({ isOpen: false }),
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container $isMobile={isMobile}>
            <Box $isMobile={isMobile}>
                <Logo src={logoImgDark} alt="로고 이미지" />

                <form onSubmit={handleSubmit}>
                    <InputBox $error={!!emailError}>
                        <Email src={emailIcon} alt="이메일 아이콘" />
                        <Input
                            type="email"
                            placeholder="가입한 이메일을 입력해주세요."
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) setEmailError("");
                            }}
                            onBlur={() => {
                                if (!email.trim()) {
                                    setEmailError("가입한 이메일을 입력해주세요.");
                                } else if (!validateEmail(email)) {
                                    setEmailError("올바른 이메일 형식을 입력해주세요.");
                                }
                            }}
                        />
                    </InputBox>
                    {emailError && <ErrorText>{emailError}</ErrorText>}

                    <SubmitButton
                        type="submit"
                        disabled={!email.trim() || isLoading}
                    >
                        {isLoading ? "초기화 링크 전송중" : "비밀번호 초기화 링크 전송"}
                    </SubmitButton>
                </form>

                <BottomText onClick={() => navigate("/login")}>
                    로그인 화면으로 돌아가기
                </BottomText>
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

export default PasswordResetRequest;
