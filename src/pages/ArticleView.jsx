import React, { useState, useEffect, useMemo } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useMediaQuery } from "react-responsive";

// CKEditor 콘텐츠 CSS
import "ckeditor5/ckeditor5.css";

// assets
import userAvatar  from "../assets/imgs/Sahuru.png";
import likeIcon    from "../assets/imgs/Like.png";
import unlikeIcon   from "../assets/imgs/Unlike.png";
import commentIcon from "../assets/imgs/Comment.png";
import CommentListItem from "../components/CommetListItem.jsx";
import CommentInput from "../components/CommentInput.jsx";
import {timeForToday} from "../utils/timeForToday.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import {commentApi} from "../api/commentApi.js";
import {articleApi} from "../api/articleApi.js";

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

const ArticleControls = styled.div`
    margin-left: auto;
    display:flex; align-items:center;
    font-size: ${({ $ismobile }) => ($ismobile ? "12px" : "14px")};
    color:#666;
    & > span {
        cursor:pointer;
        &:hover { color:#c00; }
        & + span {
            margin-left: 8px;
            padding-left: 8px;
            border-left: 1px solid #ccc;
        }
    }
`;

const ArticleView = () => {
    const isMobile = useMediaQuery({ query: "(max-width:767px)" });

    // 쿼리스트링에서 id 추출
    const id = useMemo(() => new URLSearchParams(window.location.search).get("id"), []);

    // 게시판
    const [article, setArticle] = useState(null);
    const { getArticleApi, toggleLikeApi, deleteArticleApi } = articleApi();
    const [articleDeleteDialogOpen, setArticleDeleteDialogOpen] = useState(false);

    // 댓글
    const [comments, setComments] = useState([]);
    const { getCommentList, postComment, putComment, deleteComment } = commentApi();

    // 댓글 수정
    const [editingCommentId, setEditingCommentId] = useState(null);
    const handleEditClick = (id) => setEditingCommentId(id);
    const handleEditCancel = () => setEditingCommentId(null);

    // 댓글 삭제
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    useEffect(() => {
        if (!id) return;

        // 게시글 불러오기
        getArticleApi(id)
            .then(res => res.data.success && setArticle(res.data.data))
            .catch(console.error);

        // 댓글 불러오기
        getCommentList(id)
            .then(res => {
                if (res.data.success) setComments(res.data.data);
            })
            .catch(console.error);
    }, [id]);

    // 좋아요 클릭 이벤트
    const handleLikeClick = async () => {
        if (!article) return;
        try {
            const res = await toggleLikeApi(article.id);
            if (res.data.success) {
                // 토글 후 상세 데이터 다시 조회
                const articleRes = await getArticleApi(id);
                if (articleRes.data.success) {
                    setArticle(articleRes.data.data);
                }
            } else {
                alert(res.data.message || "좋아요 처리 실패");
            }
        } catch (e) {
            console.error(e);
            alert("좋아요 처리 중 오류 발생");
        }
    };

    // 게시글 삭제 이벤트
    const handleArticleDelete = async () => {
        try {
            const res = await deleteArticleApi(article.id);
            if (res.data.success) {
                window.location.href = "../article-list";
            } else {
                alert(res.data.message || "게시글 삭제 실패");
            }
        } catch (e) {
            console.error(e);
            alert("게시글 삭제 중 오류 발생");
        }
    };

    // 댓글 등록 이벤트
    const handleCommentSubmit = async (content) => {
        try {
            // 댓글 등록
            const res = await postComment(id, content);
            if (res.data.success) {
                // 등록 후 댓글 목록 새로고침
                const listRes = await getCommentList(id);
                if (listRes.data.success) setComments(listRes.data.data);
                getArticleApi(id)
                    .then(res => res.data.success && setArticle(res.data.data));
            } else {
                alert(res.data.message || "댓글 등록 실패");
            }
        } catch (e) {
            alert("댓글 등록 중 오류 발생");
            console.error(e);
        }
    };

    // 댓글 수정 이벤트
    const handleEditComplete = async (id, newContent) => {
        try {
            // 수정 API 호출
            const res = await putComment(id, newContent, article.id);
            if (res.data.success) {
                // 성공 시 댓글 목록 새로고침
                const listRes = await getCommentList(article.id);
                if (listRes.data.success) setComments(listRes.data.data);
                setEditingCommentId(null);
                getArticleApi(article.id)
                    .then(res => res.data.success && setArticle(res.data.data));
            } else {
                alert(res.data.message || "댓글 수정 실패");
            }
        } catch (e) {
            console.error(e);
            alert("댓글 수정 중 오류 발생");
        }
    };

    // 댓글 삭제 다이얼로그 확인 이벤트
    const handleDeleteClick = (commentId) => {
        setCommentToDelete(commentId);
        setDeleteDialogOpen(true);
    };

    // 뎃글 삭제 다이얼로그 취소 이벤트
    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setCommentToDelete(null);
    };

    // 댓글 삭제 이벤트
    const handleDeleteConfirm = async () => {
        try {
            if (!commentToDelete) return;
            const res = await deleteComment(commentToDelete);
            if (res.data.success) {
                // 삭제 후 목록 새로고침
                const listRes = await getCommentList(article.id);
                if (listRes.data.success) setComments(listRes.data.data);
                getArticleApi(article.id)
                    .then(res => res.data.success && setArticle(res.data.data));
            } else {
                alert(res.data.message || "댓글 삭제 실패");
            }
        } catch (e) {
            console.error(e);
            alert("댓글 삭제 중 오류 발생");
        } finally {
            setDeleteDialogOpen(false);
            setCommentToDelete(null);
        }
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

                    {article.myArticle && (
                        <ArticleControls $ismobile={isMobile}>
                            <span onClick={() => window.location.href = `/article-write?id=${article.id}`}>수정</span>
                            <span onClick={() => setArticleDeleteDialogOpen(true)}>삭제</span>
                        </ArticleControls>
                    )}
                </CategoryRow>

                <Title $ismobile={isMobile}>{article.title}</Title>

                <MetaRow $ismobile={isMobile}>
                    <AuthorRow>
                        <Avatar src={article.profileImage || userAvatar} alt="작성자" $ismobile={isMobile}/>
                        <AuthorInfo $ismobile={isMobile}>
                            <span>{article.nickname}</span>
                            <span>{timeForToday(article.createdAt)}{article.modify && " (수정됨)"}</span>
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
                    <ActionButton
                        $ismobile={isMobile}
                        $active={article.myLike}
                        onClick={handleLikeClick}
                    >
                        <img
                            src={article.myLike ? likeIcon : unlikeIcon}
                            alt="좋아요"
                        />
                        {article.likeCount}
                    </ActionButton>
                    <ActionButton $ismobile={isMobile}>
                        <img src={commentIcon} alt="댓글" />{article.commentCount}
                    </ActionButton>
                </ActionContainer>

                {/* 댓글 입력칸 */}
                <CommentInput onSubmit={handleCommentSubmit} avatar={article.profileImage} nickname={article.nickname} />

                {/* 댓글 리스트 */}
                <div style={{ marginTop: "40px" }}>
                    {comments.length === 0 ? (
                        <div style={{ color: "#999", padding: "16px 0" }}>댓글이 없습니다.</div>
                    ) : (
                        comments.map(c => (
                            <CommentListItem
                                key={c.id}
                                comment={{
                                    ...c,
                                    createdAt: c.createAt
                                }}
                                isMine={c.myComment}
                                editing={editingCommentId === c.id}
                                onDelete={handleDeleteClick}
                                onReport={() => {/* 신고 구현 */}}
                                onEdit={handleEditClick}
                                onEditComplete={handleEditComplete}
                                onEditCancel={handleEditCancel}
                            />
                        ))
                    )}
                </div>
            </Container>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                title="댓글을 삭제하시겠습니까?"
                message="삭제된 댓글은 복구할 수 없습니다."
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                showCancel={true}
                isRedButton={true}
            />

            <ConfirmDialog
                isOpen={articleDeleteDialogOpen}
                title="게시글을 삭제하시겠습니까?"
                message="삭제된 게시글은 복구할 수 없습니다."
                showCancel={true}
                isRedButton={true}
                onConfirm={handleArticleDelete}
                onCancel={() => setArticleDeleteDialogOpen(false)}
            />
        </>
    );
};

export default ArticleView;
