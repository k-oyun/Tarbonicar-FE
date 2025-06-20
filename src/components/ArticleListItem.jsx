import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { timeForToday } from "../utils/timeForToday.js";
import Sahuru from "../assets/imgs/Sahuru.png";
import like from "../assets/Svgs/like.svg";
import unlike from "../assets/Svgs/unlike.svg";
import comment from "../assets/Svgs/comment.svg";

const Card = styled.div`
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;

    &:hover {
        background-color: #f9f9f9;
    }
`;

const Image = styled.img`
    width: 100%;
    height: 160px;
    object-fit: cover;
`;

const IconImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const Content = styled.div`
    padding: 12px 16px;
`;

const Title = styled.h3`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 4px;
`;

const Text = styled.p`
    font-size: 14px;
    color: #555;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
`;

const Bottom = styled.div`
    margin-top: 8px;
    font-size: 12px;
    color: #888;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const IconGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const ArticleListItem = ({article}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`../article-view`, { state: `${article.id}` });
    }

    return (
        <Card onClick={handleClick}>
            <Image src={article.imageUrl || Sahuru} alt="차량 이미지" />
            <Content>
                <Title>{article.title || "제목 없음"}</Title>
                <Text>{article.content || "내용 없음"}</Text>
                <Bottom>
                    <span>{article.createAt ? timeForToday(article.createAt) : "방금 전"}</span>
                    <IconGroup>
                        <IconImage src={article.myLike ? like : unlike} alt="좋아요" /> {article.likeCount ?? 0}
                        <IconImage src={comment} alt="댓글" /> {article.commentCount ?? 0}
                    </IconGroup>
                </Bottom>
            </Content>
        </Card>
    );
};

export default ArticleListItem;
