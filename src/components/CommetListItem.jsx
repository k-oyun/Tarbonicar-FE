import React, {forwardRef, useState} from "react";
import styled from "styled-components";
import profileIcon from "../assets/imgs/profileIcon.png";
import {timeForToday} from "../utils/timeForToday.js";

const Wrapper = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 20px 0;
    border-bottom: 1px solid #f1f1f1;
`;

const Avatar = styled.img`
    width: 25px;
    height: 25px;
    border-radius: 50%;
    object-fit: cover;
`;

const Body = styled.div`
    flex: 1;
`;

const TopRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
`;

const Nickname = styled.span`
    font-weight: bold;
    font-size: 15px;
    color: #222;
`;

const Date = styled.span`
    font-size: 13px;
    color: #aaa;
`;

const Content = styled.div`
    font-size: 15px;
    color: #333;
    margin-bottom: 4px;
    padding: 5px 0;
    word-break: break-all;
    white-space: pre-line;
`;

const Actions = styled.div`
    display: flex;
    gap: 10px;
    font-size: 13px;
    color: #888;
`;

const SpanButton = styled.span`
    cursor: pointer;
    &:hover {
        text-decoration: underline;
        color: #002C5F;
    }
`;

const EditInputRow = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
    margin: 10px 0;
`;

const EditInput = styled.textarea`
    flex: 1;
    min-height: 34px;
    border-radius: 6px;
    border: 1px solid #ddd;
    padding: 6px 10px;
    font-size: 15px;
    background: #fafbfc;
    resize: none;
`;

const EditBtn = styled.button`
    padding: 5px 12px;
    background: #002c5f;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 13px;
    cursor: pointer;
    &:disabled { background: #aaa; }
    & + & { background: #eee; color: #444; }
`;

const CommentListItem = forwardRef((
    { comment, isMine, editing, onDelete, onReport, onEdit, onEditComplete, onEditCancel }, ref
) => {
    const [editValue, setEditValue] = useState(comment.content);

    // 댓글 수정 모드
    if (editing) {
        return (
            <Wrapper ref={ref}>
                <Body>
                    <TopRow>
                        <Avatar src={comment.profileImage || profileIcon} alt="프로필" />
                        <Nickname>{comment.nickname}</Nickname>
                    </TopRow>
                    <EditInputRow>
                        <EditInput
                            value={editValue}
                            maxLength={200}
                            onChange={e => setEditValue(e.target.value)}
                        />
                        <EditBtn
                            type="button"
                            onClick={() => onEditComplete(comment.id, editValue)}
                            disabled={!editValue.trim()}
                        >수정</EditBtn>
                        <EditBtn type="button" onClick={onEditCancel}>취소</EditBtn>
                    </EditInputRow>
                </Body>
            </Wrapper>
        );
    }

    // 평소 댓글 보기 모드
    return (
        <Wrapper ref={ref}>
            <Body>
                <TopRow>
                    <Avatar src={comment.profileImage || profileIcon} alt="프로필" />
                    <Nickname>{comment.nickname}</Nickname>
                </TopRow>
                <Content>{comment.content}</Content>
                <Actions>
                    <Date>{timeForToday(comment.createdAt)}{comment.modify && " (수정됨)"}</Date>
                    {/*|*/}
                    {/*<SpanButton onClick={() => onReport(comment.id)}>신고</SpanButton>*/}
                    {isMine && (
                        <>
                            |
                            <SpanButton onClick={() => onEdit(comment.id)}>수정</SpanButton>
                            |
                            <SpanButton onClick={() => onDelete(comment.id)}>삭제</SpanButton>
                        </>
                    )}
                </Actions>
            </Body>
        </Wrapper>
    );
});

export default CommentListItem;