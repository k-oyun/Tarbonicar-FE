import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { articleApi } from "../api/articleApi";
import ArticleListItem from "../components/ArticleListItem.jsx";
import SortDropdown from "../components/SortDropdown";

const Container = styled.div`
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
  padding: 40px 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.$ismobile ? "column" : "row")};
  align-items: flex-start;
  gap: 32px;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SortWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
`;

const CardGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  cursor: pointer;
`;

const sortOptions = [
  { label: "최근 작성 순", value: "RECENT" },
  { label: "마지막 작성 순", value: "UPDATED" },
  { label: "좋아요 순", value: "LIKES" },
];

const MyArticle = () => {
  const isMobile = useMediaQuery({ query: "(max-width:767px)" });
  const { getMyArticleListApi } = articleApi();

  const [sortType, setSortType] = useState("RECENT");
  const [articleList, setArticleList] = useState([]);

  useEffect(() => {
    const fetchMyArticles = async () => {
      try {
        const res = await getMyArticleListApi(sortType);
        setArticleList(res.data.data);
      } catch (err) {
        console.error("내 글 목록 조회 실패:", err);
        setArticleList([]);
      }
    };

    fetchMyArticles();
  }, [sortType]); // 🔄 sortType이 바뀔 때마다 다시 요청

  return (
    <Container>
      <BreadCrumb $ismobile={isMobile}>
        홈 &gt; <a href="/my-page"> 마이페이지 &gt;</a>
        <a href="/my-article"> 내가 작성한 글</a>
      </BreadCrumb>

      <TitleSection>
        <Title>내가 작성한 글</Title>
        <Subtitle>회원님이 등록한 게시글 목록입니다.</Subtitle>
      </TitleSection>

      <Content $ismobile={isMobile}>
        <Layout $ismobile={isMobile}>
          <ContentArea>
            <SortWrapper>
              <SortDropdown
                options={sortOptions}
                value={sortType}
                onChange={setSortType}
                $isMobile={isMobile}
              />
            </SortWrapper>
            <CardGrid>
              {articleList.length > 0 ? (
                articleList.map((article, i) => (
                  <ArticleListItem key={article.id || i} article={article} />
                ))
              ) : (
                <div>작성한 글이 없습니다.</div>
              )}
            </CardGrid>
          </ContentArea>
        </Layout>
      </Content>
    </Container>
  );
};

export default MyArticle;
