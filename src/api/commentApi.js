import axios from './AxiosInstance.js';

export const commentApi = () => {

    // 댓글 리스트 조회
    const getCommentList = async (articleId) => {
        return await axios.get('/api/v1/comment', {
            params: { articleId }
        });
    };

    // 댓글 등록
    const postComment = async (articleId, content) => {
        return await axios.post('/api/v1/comment', {
            articleId,
            content,
        });
    };

    // 댓글 수정
    const putComment = async (commentId, content, articleId) => {
        return await axios.put(`/api/v1/comment`, {
            commentId, content, articleId
        });
    };

    // 댓글 삭제
    const deleteComment = async (commentId) => {
        return await axios.delete(`/api/v1/comment/${commentId}`);
    };

    return { getCommentList, postComment, putComment, deleteComment };
};