import { useNavigate, useLocation } from "react-router-dom";
import { articleApi } from "../api/articleApi.js";
import ArticleFilter from "../components/ArticleFilter.jsx";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import ArticleListItem from "../components/ArticleListItem.jsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "@mui/material";

// 전체 컨텐츠 영역
const Content = styled.div`
  padding-top: ${(props) => (props.$ismobile ? "100px" : "120px")};
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

  @media (max-width: 767px) {
    justify-content: center;
  }
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

  @media (max-width: 767px) {
    width: 100%;
    margin-right: 0;
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
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0); // 1부터 시작
  const pageSize = 12; // 한 페이지당 게시글 개수, 마음대로 조정

  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef();

  const { getArticleListApi } = articleApi();

  const norm = (val) => (!val || val === "all" ? "" : val);
  const arrNorm = (val) => (!val || val === "all" ? [] : [val]);
  const arrNumNorm = (val) => (!val || val === "all" ? [] : [Number(val)]);

  const filterInfo = location.state || {};

  // 필터값 상태
  const [filters, setFilters] = useState({
    carType: norm(filterInfo.type),
    carNames: arrNorm(filterInfo.name),
    carAges: arrNumNorm(filterInfo.year),
    articleTypes: [],
    sortType: "RECENT",
  });

  // PC: 페이지가 바뀔 때마다 새로 덮어쓰기, 모바일: 누적
  useEffect(() => {
    setArticleList([]);
    setPage(0);
    setIsLastPage(false);
    setTotalPages(1);

    if (isMobile) {
      // 모바일: 필터 바뀌면 첫 페이지부터 누적 초기화
      loadMoreArticles(0, true);
    } else {
      // PC: 해당 페이지 데이터로 새로 덮어쓰기
      fetchList(page);
    }
    // eslint-disable-next-line
  }, [filters, isMobile]);

  useEffect(() => {
    if (!isMobile) {
      fetchList(page);
    }
    // eslint-disable-next-line
  }, [page]);

  // 리스트 조회
  // PC 페이지 요청
  const fetchList = async (targetPage = 0) => {
    try {
      setIsLoading(true);
      const res = await getArticleListApi({
        ...filters,
        page: targetPage,
        size: pageSize,
      });
      const { content, totalPages, last } = res.data.data;
      setArticleList(content);
      setTotalPages(totalPages);
      setIsLastPage(last);
    } catch (e) {
      setArticleList([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // 모바일: 무한 스크롤로 누적
  const loadMoreArticles = async (targetPage, isReset = false) => {
    if (isReset) {
      setArticleList([]);
      setPage(0);
      setIsLastPage(false);
      setTotalPages(1);
      fetchList(0);
    }
    if (isLoading || isLastPage) return;
    setIsLoading(true);
    try {
      const res = await getArticleListApi({
        ...filters,
        page: targetPage,
        size: pageSize,
      });
      const { content, last, totalPages } = res.data.data;
      setArticleList((prev) => (isReset ? content : [...prev, ...content]));
      setPage(targetPage);
      setIsLastPage(last);
      setTotalPages(totalPages);
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  // 무한 스크롤: 마지막 카드에 ref 달기
  const lastItemRef = useCallback(
    (node) => {
      if (!isMobile) return;
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLastPage && !isLoading) {
          loadMoreArticles(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isMobile, isLastPage, isLoading, page]
  );

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const writeClick = () => {
    navigate("../article-write");
  };

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
                <div>게시글이 없습니다.</div>
              )}
            </CardGrid>
            {/* 페이지네이션 */}
            {!isMobile && totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 28,
                }}
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
            {/* 모바일에서 로딩중 메시지 */}
            {isMobile && isLoading && (
              <div style={{ textAlign: "center", color: "#aaa", padding: 12 }}>
                게시글 불러오는 중...
              </div>
            )}
          </ContentArea>
        </Layout>
      </Content>
    </>
  );
};

export default ArticleList;
