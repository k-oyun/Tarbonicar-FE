import React, { useEffect, useState, useCallback, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { articleApi } from "../api/articleApi";
import ArticleListItem from "../components/ArticleListItem.jsx";
import SortDropdown from "../components/SortDropdown";
import { Pagination } from "@mui/material";

// Styled Components
const Container = styled.div`
  margin: 0 auto;
  font-family: "Noto Sans KR", sans-serif;
  color: #333;
  min-height: 100vh;
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
  font-size: ${(props) => (props.$ismobile ? "22px" : "24px")};
  font-weight: 700;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: ${(props) => (props.$ismobile ? "11px" : "12px")};
  color: #999;
  letter-spacing: 4px;
`;

const Content = styled.div`
  padding: 40px 30px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const SortWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: 13px;
  right: 39px;
  z-index: 1000;
  height: ${(props) => (props.$isOpen ? "200px" : "20px")};
  width: 150px;
`;

const CardGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  cursor: pointer;
`;

const MyArticle = () => {
  const isMobile = useMediaQuery({ query: "(max-width:767px)" });
  const { getMyArticleListApi } = articleApi();
  const [sortType, setSortType] = useState("RECENT");
  const [articleList, setArticleList] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const observer = useRef();
  const pageSize = 20;

  const sortOptions = [
    { label: "최근 작성 순", value: "RECENT" },
    { label: "오래된 순", value: "OLDEST" },
    { label: "좋아요 순", value: "MOSTLIKED" },
    { label: "조회수 순", value: "MOSTVIEW" },
  ];
  useEffect(() => {
    sortOptions;
  }, [isOpen]);

  useEffect(() => {
    setOpen(false);
  }, [sortType]);
  // 공통 로드 함수: 모바일은 누적, PC는 교체
  const loadArticles = async (targetPage, isReset = false) => {
    if (isLoading || (isMobile && isLastPage && targetPage !== 0)) return;
    setIsLoading(true);
    try {
      const res = await getMyArticleListApi(sortType, targetPage, pageSize);
      const { content, totalPages, last } = res.data.data;
      setArticleList((prev) => (isReset ? content : [...prev, ...content]));
      setTotalPages(totalPages);
      setIsLastPage(last);
      setPage(targetPage);
    } catch {
      if (isReset) setArticleList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 정렬 변경 또는 모바일 전환 시 초기화 후 1페이지 로드
  useEffect(() => {
    setArticleList([]);
    setIsLastPage(false);
    setTotalPages(1);
    setPage(0);
    loadArticles(0, true);
  }, [sortType, isMobile]);

  useEffect(() => {
    if (!isMobile) {
      loadArticles(page, true);
    }
  }, [page, isMobile]);

  // 무한스크롤: 마지막 요소 감지
  const lastItemRef = useCallback(
    (node) => {
      if (!isMobile || isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLastPage) {
          loadArticles(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isMobile, isLoading, isLastPage, page, sortType]
  );

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  return (
    <Container>
      <BreadCrumb $ismobile={isMobile}>
        홈 &gt; <a href="/my-page">마이페이지 </a>
        &gt;
        <a href="/my-article"> 내가 작성한 글</a>
      </BreadCrumb>

      <TitleSection>
        <Title $ismobile={isMobile}>내가 작성한 글</Title>
        <Subtitle $ismobile={isMobile}>
          회원님이 등록한 게시글 목록입니다.
        </Subtitle>
      </TitleSection>

      <Content>
        <SortWrapper $isOpen={isOpen}>
          <SortDropdown
            options={sortOptions}
            value={sortType}
            onChange={setSortType}
            isOpen={setOpen}
          />
        </SortWrapper>

        <CardGrid>
          {articleList.length > 0 ? (
            articleList.map((article, idx) => {
              const isLast = isMobile && idx === articleList.length - 1;
              return (
                <ArticleListItem
                  key={article.id || idx}
                  article={article}
                  ref={isLast ? lastItemRef : undefined}
                />
              );
            })
          ) : (
            <div>작성한 글이 없습니다.</div>
          )}
        </CardGrid>

        {!isMobile && totalPages > 1 && (
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 28 }}
          >
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={handlePageChange}
              shape="rounded"
              color="primary"
              siblingCount={1}
              boundaryCount={1}
              showFirstButton
              showLastButton
            />
          </div>
        )}

        {isMobile && isLoading && (
          <div style={{ textAlign: "center", color: "#aaa", padding: 12 }}>
            게시글 불러오는 중...
          </div>
        )}
      </Content>
    </Container>
  );
};

export default MyArticle;
