import Header from "../components/Header.jsx";
import BoardFilter from "../components/BoardFilter.jsx";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";

// 전체 컨텐츠 영역
const Content = styled.div`
    padding-top: ${props => props.$ismobile ? '100px' : '120px'};
    max-width: 1200px;
    margin: 0 auto;
`;

// 필터 + 게시글 영역
const Layout = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 32px;
`;

// 오른쪽 콘텐츠 전체 (작성 버튼 + 카드 리스트)
const RightArea = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
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
    padding: 10px 16px;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const BoardList = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

    return (
        <>
            <Header />
            <Content $ismobile={isMobile}>
                <Layout>
                    {/* 왼쪽 필터 */}
                    <BoardFilter />

                    {/* 오른쪽: 작성 버튼 + 카드 목록 */}
                    <RightArea>
                        <TopBar>
                            <WriteButton>작성하기</WriteButton>
                        </TopBar>
                        <CardGrid>
                            {/* 예시 카드들 들어갈 자리 */}
                        </CardGrid>
                    </RightArea>
                </Layout>
            </Content>
        </>
    );
};

export default BoardList;
