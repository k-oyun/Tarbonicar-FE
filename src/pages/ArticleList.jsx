import { useNavigate, useLocation } from "react-router-dom";
import { articleApi } from "../api/ArticleApi.js";
import ArticleFilter from "../components/ArticleFilter/ArticleFilter.jsx";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import ArticleListItem from "../components/ArticleListItem.jsx";
import { useEffect, useState } from "react";

// 전체 컨텐츠 영역
const Content = styled.div`
    padding-top: ${props => props.$ismobile ? '100px' : '120px'};
    padding-left: 30px;
    padding-right: 30px;
    max-width: 1200px;
    margin: 0 auto;
`;

// 필터 + 게시글 영역
const Layout = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 32px;
    flex-direction: row;

    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

// 필터 영역
const FilterArea = styled.div`
    width: 320px;
    margin-top: 30px;

    @media (max-width: 767px) {
        width: 100%;
    }
`;

// 오른쪽 콘텐츠 전체 (작성 버튼 + 카드 리스트)
const ContentArea = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    @media (max-width: 767px) {
        width: 100%;
    }
`;

// 작성 버튼 정렬 영역
const TopBar = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
`;

// 작성 버튼
const WriteButton = styled.button`
    background-color: #002c5f;
    color: white;
    border: none;
    padding: 16px 40px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    margin-right: 16px;

    &:hover {
        background-color: #001e3e;
    }
`;

// 카드 리스트 영역
const CardGrid = styled.div`
    display: grid;
    gap: 20px;
    padding: 16px;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    cursor: pointer;
    
    @media (max-width: 767px) {
        width: auto;
    }
`;

const ArticleList = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
    const navigate = useNavigate();
    const location = useLocation();
    const [articleList, setArticleList] = useState([]);
    console.log('이전화면에서 전달된 state:', location.state);

    const norm = val => !val || val === "all" ? "" : val;
    const arrNorm = val => !val || val === "all" ? [] : [val];
    const arrNumNorm = val => !val || val === "all" ? [] : [Number(val)];

    const filterInfo = location.state || {};

    // 필터값 상태
    const [filters, setFilters] = useState({
        carType: norm(filterInfo.type),
        carNames: arrNorm(filterInfo.name),
        carAges: arrNumNorm(filterInfo.year),
        articleTypes: [],
        sortType: "RECENT"
    });

    // 리스트 조회
    useEffect(() => {
        const fetchList = async () => {
            try {
                const { articleList: fetchArticleList } = articleApi();
                const res = await fetchArticleList(filters);
                setArticleList(res.data.data); // 백엔드 응답에 따라 .data 경로 수정
            } catch (e) {
                setArticleList([]);
            }
        };
        fetchList();
    }, [filters]); // filters가 바뀔 때마다 재요청

    const writeClick = () => {
        navigate("../article-write");
    }

    return (
        <>
            <Content $ismobile={isMobile}>
                <Layout>
                    {/* 왼쪽 (또는 위쪽) 필터 */}
                    <FilterArea>
                        <ArticleFilter filters={filters} setFilters={setFilters} />
                    </FilterArea>

                    {/* 오른쪽 (또는 아래쪽) 콘텐츠 */}
                    <ContentArea>
                        <TopBar>
                            <WriteButton onClick={writeClick}>작성하기</WriteButton>
                        </TopBar>
                        <CardGrid>
                            {articleList && articleList.length > 0 ? (
                                articleList.map((article, i) =>
                                    <ArticleListItem key={article.id || i} article={article} />
                                )
                            ) : (
                                <div>게시글이 없습니다.</div>
                            )}
                        </CardGrid>
                    </ContentArea>
                </Layout>
            </Content>
        </>
    );
};

export default ArticleList;
