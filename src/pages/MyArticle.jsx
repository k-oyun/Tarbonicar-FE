import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import ArticleListItem from "../components/ArticleListItem.jsx";
import SortDropdown from "../components/SortDropdown";

const Container = styled.div`
  /* padding-top: 80px; 헤더 높이만큼 */
  /* max-width: 900px; */
  margin: 0 auto;
  font-family: "Noto Sans KR", sans-serif;
  color: #333;
`;

const BreadCrumb = styled.div`
  font-size: 14px;
  color: #666;
  background-color: #e4dcd3;
  padding-bottom: 20px;
  padding-top: ${(props) => (props.$ismobile ? "80px" : "100px")};
  padding-left: 20px;
  a {
    color: #666;
    /* color: #1d75bd; */
    text-decoration: none;
    cursor: pointer;
  }
`;

const TitleSection = styled.section`
  background-color: #f1ede9;
  padding: 30px 0;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 12px;
  color: #999;
  letter-spacing: 4px;
`;

const Content = styled.div`
  padding-top: 40px;
  padding-left: 30px;
  padding-right: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

// 필터 + 게시글 영역
const Layout = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 50px;
  gap: 32px;
  flex-direction: ${(props) => (props.$ismobile ? "column" : "row")};
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

// 버튼 오른쪽 정렬용 컨테이너
const SortWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
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

const MyArticle = () => {
  const isMobile = useMediaQuery({
    query: "(max-width:767px)",
  });

  const [sortOption, setSortOption] = useState("최근 작성순");
  const sortOptionList = [
    { value: "latest", name: "최신순" },
    { value: "oldest", name: "오래된 순" },
  ];
  return (
    <>
      <>
        <Container>
          <BreadCrumb $ismobile={isMobile}>
            홈 &gt; <a href="/my-page"> 마이페이지 &gt;</a>
            <a href="/my-article"> 내가 작성한 글</a>
          </BreadCrumb>
          <TitleSection>
            <Title>내가 작성한 글</Title>
            <Subtitle>이용 중인 타보니까를 어쩌구 저쩌구 ㄴㅇㅁㅇㄴ</Subtitle>
          </TitleSection>
          <Content $ismobile={isMobile}>
            <Layout $ismobile={isMobile}>
              {/* 오른쪽 (또는 아래쪽) 콘텐츠 */}
              <ContentArea>
                <SortWrapper>
                  <SortDropdown
                    selected={sortOption}
                    onSelect={setSortOption}
                  />
                </SortWrapper>
                <CardGrid>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <ArticleListItem key={i} />
                  ))}
                </CardGrid>
              </ContentArea>
            </Layout>
          </Content>
        </Container>
      </>
    </>
  );
};

export default MyArticle;
