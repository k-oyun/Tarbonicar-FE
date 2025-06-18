import { useNavigate } from "react-router-dom";
import BoardFilter from "../components/BoardFilter/BoardFilter.jsx";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import BoardItem from "../components/BoardItem.jsx";

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

    &:hover {
        background-color: #001e3e;
    }
`;

// 카드 리스트 영역
const CardGrid = styled.div`
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    cursor: pointer;
    
    @media (max-width: 767px) {
        width: 100%;
    }
`;

const BoardList = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
    const navigate = useNavigate();

    const writeClick = () => {
        navigate("../article-write");
    }

    return (
        <>
            <Content $ismobile={isMobile}>
                <Layout>
                    {/* 왼쪽 (또는 위쪽) 필터 */}
                    <FilterArea>
                        <BoardFilter />
                    </FilterArea>

                    {/* 오른쪽 (또는 아래쪽) 콘텐츠 */}
                    <ContentArea>
                        <TopBar>
                            <WriteButton onClick={writeClick}>작성하기</WriteButton>
                        </TopBar>
                        <CardGrid>
                            {Array.from({ length: 10 })
                                .map((_, i) => (<BoardItem key={i} />))}
                        </CardGrid>
                    </ContentArea>
                </Layout>
            </Content>
        </>
    );
};

export default BoardList;
