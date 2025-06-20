import React, { useState, useEffect, useMemo } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useMediaQuery } from "react-responsive";
import useArticleApi from "../api/articleView.js";

// CKEditor 콘텐츠 CSS
import "ckeditor5/ckeditor5.css";

// assets
import userAvatar  from "../assets/imgs/Sahuru.png";
import likeIcon    from "../assets/imgs/Like.png";
import commentIcon from "../assets/imgs/Comment.png";

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Oswald&family=Lato:wght@300;400;700&display=swap');

    body        { margin:0; font-family:'Lato',sans-serif; }
    .ck-content { font-family:'Lato',sans-serif; line-height:1.6; word-break:break-word; }
    .ck-content img { max-width:100%; height:auto; }
`;

const Container = styled.div`
    max-width: 900px;
    margin: 0 auto;
    padding: ${({ $ismobile }) => ($ismobile ? "100px 15px 40px" : "120px 20px 60px")};
`;

const CategoryRow = styled.div`
    display:flex; align-items:center; flex-wrap:wrap;
    gap:6px;                                      /* 카테고리·태그 간 여백 */
    margin-bottom:${({ $ismobile }) => ($ismobile ? "8px" : "12px")};
`;

const Category = styled.div`
    font-size: ${({ $ismobile }) => ($ismobile ? "12px" : "14px")};
    color:#999;
`;

const Tag = styled.span`
    display:inline-block;
    padding:3px 8px;
    background:#e9eaec;
    border-radius:12px;
    font-weight:600;
    font-size:${({ $ismobile }) => ($ismobile ? "12px" : "13px")};
    color:#666;
`;

const Title = styled.h1`
    font-size:${({ $ismobile }) => ($ismobile ? "20px" : "24px")};
    font-weight:700; color:#333; margin-bottom:${({ $ismobile }) => ($ismobile ? "8px" : "12px")};
`;

const MetaRow = styled.div`
    display:flex; justify-content:space-between; align-items:center;
    margin-bottom:${({ $ismobile }) => ($ismobile ? "6px" : "8px")};
`;

const AuthorRow = styled.div`display:flex; align-items:center;`;
const Avatar = styled.img`
    width:${({ $ismobile }) => ($ismobile ? "30px" : "45px")};
    height:${({ $ismobile }) => ($ismobile ? "30px" : "45px")};
    border-radius:50%; object-fit:cover; margin-right:${({ $ismobile }) => ($ismobile ? "8px" : "12px")};
`;

const AuthorInfo = styled.div`
    display:flex; align-items:center;
    font-size:${({ $ismobile }) => ($ismobile ? "12px" : "14px")}; color:#333;
    & > span + span { margin-left:${({ $ismobile }) => ($ismobile ? "8px" : "12px")}; color:#999; }
`;

const ViewCount = styled.span`
    font-size:${({ $ismobile }) => ($ismobile ? "12px" : "14px")}; color:#999;
`;

const Divider = styled.hr`
    border:none; border-top:1px solid #e0e0e0;
    margin:${({ $ismobile }) => ($ismobile ? "12px -15px" : "16px -20px")};
`;

const Content = styled.div.attrs({ className: "ck-content" })`
    font-size:${({ $ismobile }) => ($ismobile ? "14px" : "16px")};
    color:#333; white-space:pre-wrap;
`;

const ActionContainer = styled.div`
    display:flex; gap:${({ $ismobile }) => ($ismobile ? "20px" : "30px")};
    margin-top:${({ $ismobile }) => ($ismobile ? "8px" : "12px")};
`;

const ActionButton = styled.button`
    display:flex; align-items:center; background:none; border:none; cursor:pointer;
    font-size:${({ $ismobile }) => ($ismobile ? "14px" : "16px")};
    color:${({ $active }) => ($active ? "#c00" : "#333")};
    transition:transform .2s;
    &:hover{ transform:scale(1.1); }
    img{ width:${({ $ismobile }) => ($ismobile ? "16px" : "20px")}; margin-right:5px; }
`;

const ArticleView = () => {
    const isMobile = useMediaQuery({ query: "(max-width:767px)" });

    // 쿼리스트링에서 id 추출
    const id = useMemo(() => new URLSearchParams(window.location.search).get("id"), []);

    const [article, setArticle] = useState(null);
    const { getArticle } = useArticleApi();

    useEffect(() => {
        if (!id) return;

        getArticle(id)
            .then(res => res.data.success && setArticle(res.data.data))
            .catch(console.error);
    }, [id]);

    const displayTime = iso => {
        const now = new Date();
        const created = new Date(iso);
        const diffSec = Math.floor((now - created) / 1000);

        if (diffSec < 0) return "";
        if (diffSec < 5)  return "방금 전";
        if (diffSec < 60) return `${diffSec}초 전`;

        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin}분 전`;

        const diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) return `${diffHour}시간 전`;

        const Y = created.getFullYear();
        const M = String(created.getMonth() + 1).padStart(2, "0");
        const D = String(created.getDate()).padStart(2, "0");
        const h = String(created.getHours()).padStart(2, "0");
        const m = String(created.getMinutes()).padStart(2, "0");
        return `${Y}.${M}.${D} ${h}:${m}`;
    };

    const typeMap = { REVIEW:"차량 리뷰", TIP:"차량 팁", TESTDRIVE:"시승 후기" };

    const carNameTag = article ? `#${article.carName}` : "";
    const carAgeTag  = article ? `#${String(article.carAge).slice(2)}년식` : "";

    if (!article) return (
        <>
            <GlobalStyle />
            <Container $ismobile={isMobile}>로딩 중...</Container>
        </>
    );

    return (
        <>
            <GlobalStyle />

            <Container $ismobile={isMobile}>
                <CategoryRow $ismobile={isMobile}>
                    <Category $ismobile={isMobile}>{typeMap[article.articleType]}</Category>
                    <Tag $ismobile={isMobile}>{carNameTag}</Tag>
                    <Tag $ismobile={isMobile}>{carAgeTag}</Tag>
                </CategoryRow>

                <Title $ismobile={isMobile}>{article.title}</Title>

                <MetaRow $ismobile={isMobile}>
                    <AuthorRow>
                        <Avatar src={article.profileImage || userAvatar} alt="작성자" $ismobile={isMobile}/>
                        <AuthorInfo $ismobile={isMobile}>
                            <span>{article.nickname}</span>
                            <span>{displayTime(article.createdAt)}{article.modify && " (수정됨)"}</span>
                        </AuthorInfo>
                    </AuthorRow>
                    <ViewCount $ismobile={isMobile}>조회수 {article.viewCount}</ViewCount>
                </MetaRow>

                <Divider $ismobile={isMobile} />

                <Content
                    $ismobile={isMobile}
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                <Divider $ismobile={isMobile} />

                <ActionContainer $ismobile={isMobile}>
                    <ActionButton $ismobile={isMobile} $active={article.myLike}>
                        <img src={likeIcon} alt="좋아요" />{article.likeCount}
                    </ActionButton>
                    <ActionButton $ismobile={isMobile}>
                        <img src={commentIcon} alt="댓글" />0
                    </ActionButton>
                </ActionContainer>
            </Container>
        </>
    );
};

export default ArticleView;
