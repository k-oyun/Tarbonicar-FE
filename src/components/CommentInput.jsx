import React, { useState } from "react";
import styled from "styled-components";
import profileIcon from "../assets/imgs/profileIcon.png";

const OuterBox = styled.div`
    border: 1.5px solid #CCCCCC;
    border-radius: 10px;
    height: auto;
    padding: 18px;
    margin-top: 20px;
    background: #fff;
    margin-bottom: 18px;
    overflow: hidden;
`;

const TopRow = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
    padding-left: 4px;
    padding-right: 4px;
`;

const Avatar = styled.img`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
`;

const Nickname = styled.span`
    font-weight: bold;
    font-size: 15px;
    color: #222;
`;

const InputBox = styled.textarea`
    width: 100%;
    border: none;
    height: 100px;
    background: #ffffff;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 15px;
    outline: none;
    margin-bottom: 0;
    box-sizing: border-box;
    white-space: pre-wrap;
    //word-break: break-word;
    overflow: hidden;
    resize: none;
`;

const BottomRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 5px;
`;

const LengthText = styled.span`
    color: #888;
    font-size: 13px;
`;

const Button = styled.button`
    background: #002C5F;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 7px 18px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

const CommentInput = ({ onSubmit, avatar, nickname = "닉네임", disabled }) => {
    const [value, setValue] = useState("");
    const maxLen = 200;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onSubmit(value);
        setValue("");
    };

    return (
        <OuterBox>
            <form onSubmit={handleSubmit}>
                <TopRow>
                    <Avatar src={avatar || profileIcon} alt="프로필" />
                    <Nickname>{nickname}</Nickname>
                </TopRow>
                <InputBox
                    value={value}
                    maxLength={maxLen}
                    onChange={e => setValue(e.target.value)}
                    placeholder="댓글을 입력하세요 (최대 200자)"
                    disabled={disabled}
                />
                <BottomRow>
                    <LengthText>{value.length} / {maxLen}</LengthText>
                    <Button type="submit" disabled={!value.trim() || disabled}>
                        등록하기
                    </Button>
                </BottomRow>
            </form>
        </OuterBox>
    );
};

export default CommentInput;