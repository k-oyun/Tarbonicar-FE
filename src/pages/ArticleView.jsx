import React from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";

import userAvatar from "../assets/imgs/Sahuru.png";
import likeIcon    from "../assets/imgs/Like.png";
import commentIcon from "../assets/imgs/Comment.png";

// 최상위 컨테이너: 페이지 중앙 정렬, 상단 여백 확보, 반응형 패딩
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${(props) =>
    props.$ismobile
        ? "100px 15px 40px" // 모바일일 때: 상100px·좌우15px·하40px
        : "120px 20px 60px"}; // 데스크탑일 때: 상120px·좌우20px·하60px
`;

// 카테고리 텍스트
const Category = styled.div`
  font-size: ${(props) => (props.$ismobile ? "12px" : "14px")}; // 반응형 폰트 크기
  color: #999;
  margin-bottom: ${(props) => (props.$ismobile ? "8px" : "12px")}; // 제목과 간격
`;

// 게시글 제목
const Title = styled.h1`
  font-size: ${(props) => (props.$ismobile ? "20px" : "24px")};  // 반응형 폰트 크기
  font-weight: bold;
  color: #333;
  margin-bottom: ${(props) => (props.$ismobile ? "8px" : "12px")}; // 메타와 간격
`;

// 메타 정보 : 왼쪽(프로필 이미지+작성자/날짜), 오른쪽(조회수)
const MetaRow = styled.div`
  display: flex;
  justify-content: space-between; // 좌우 요소 분리 배치
  align-items: center;
  margin-bottom: ${(props) => (props.$ismobile ? "6px" : "8px")}; // 구분선과 간격
`;

// 메타 왼쪽: 프로필 + 작성자/날짜
const AuthorRow = styled.div`
  display: flex;
  align-items: center;
`;

// 프로필 이미지
const Avatar = styled.img`
  width: ${(props) => (props.$ismobile ? "30px" : "45px")};
  height: ${(props) => (props.$ismobile ? "30px" : "45px")};
  border-radius: 50%; // 원형
  object-fit: cover; // 이미지 크롭
  margin-right: ${(props) => (props.$ismobile ? "8px" : "12px")}; // 텍스트와 간격
`;

// 작성자 이름 및 작성일
const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: ${(props) => (props.$ismobile ? "12px" : "14px")};
  color: #333;

  & > span + span {
    margin-left: ${(props) => (props.$ismobile ? "8px" : "12px")}; // 이름과 날짜 사이
    color: #999;
  }
`;

// 우측 조회수 표시
const ViewCount = styled.span`
  font-size: ${(props) => (props.$ismobile ? "12px" : "14px")};
  color: #999;
`;

// 구분선
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: ${(props) =>
    props.$ismobile ? "12px -60px" : "16px -80px"}; // 위아래 여백, 좌우 돌출
`;

// 본문 텍스트
const Paragraph = styled.p`
  font-size: ${(props) => (props.$ismobile ? "14px" : "16px")};
  line-height: 1.6; // 줄간격
  color: #333;
  white-space: pre-wrap; // 줄바꿈 유지
`;

// 좋아요/댓글 영역
const ActionContainer = styled.div`
  display: flex;
  overflow: hidden; // 호버 시 넘침 숨김 → 스크롤바 제거
  gap: ${(props) => (props.$ismobile ? "20px" : "30px")}; // 버튼 간 간격
  margin-top: ${(props) => (props.$ismobile ? "8px" : "12px")}; // 구분선과 간격
`;

// 좋아요/댓글 버튼
const ActionButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background: none;
  font-size: ${(props) => (props.$ismobile ? "14px" : "16px")};
  color: #333;
  cursor: pointer;
  transition: transform 0.2s ease-in-out; // 스케일 애니메이션

  &:hover {
    transform: scale(1.1); // 호버 시 10% 확대
  }

  img {
    width: ${(props) => (props.$ismobile ? "16px" : "20px")}; // 아이콘 크기
    margin-right: 5px; // 텍스트와 간격
  }
`;

const ArticleView = () => {
    // 화면 크기에 따라 isMobile 플래그 설정
    const isMobile = useMediaQuery({ query: "(max-width:767px)" });

    // 더미 데이터
    const author   = "사후르";
    const date     = "2025.06.12. 17:05";
    const views    = 257;
    const bodyText = `차가 정말 동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동023년 9월 27일 정식 공개되었으며, 10월 11일부터 판매를 시작한다. 현대미가가 비레스모델이 크게 바뀌는 것과 달리 전체적인 외관 디자인의 큰 변화는 없으나, 헤드램프는 G90·RS4에 들어간 벽조형 블에 들어간 벽조형 블레이드 타입으로 바뀌었고, 크레스트 그릴은 조형 메쉬 구조로 다듬었으며, 가로 패턴이 적용된 신규 알루미늄 림이 추가되었다. 범퍼, 옆[옆] 등 디테일도 약간 수정해 완성도를 높였다. 기존 GV80 전면 범퍼는 기존 형식이나 에어 인테이크 일부가 변경되어 패널이 좀 더 부드럽게 바뀌었고, 에어 인테이크가 추가되면서 범퍼가 GV70과 비슷한 형상으로 바뀌었다. 후면부는 사실상 거의 변화가 없었고 범퍼도 파워트레인 분류 전부 히트인슐레이터로 변경해 힘이 가볍게 돌아간다. 외장 컬러는 스톤 그린이 추가된 12종류 색상으로 운영한다.차가 정말 동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동023년 9월 27일 정식 공개되었으며, 10월 11일부터 판매를 시작한다. 현대미가가 비레스모델이 크게 바뀌는 것과 달리 전체적인 외관 디자인의 큰 변화는 없으나, 헤드램프는 G90·RS4에 들어간 벽조형 블레이드 타입으로 바뀌었고, 크레스트 그릴은 조형 메쉬 구조로 다듬었으며, 가로 패턴이 적용된 신규 알루미늄 림이 추가되었다. 범퍼, 옆[옆] 등 디테일도 약간 수정해 완성도를 높였다. 기존 GV80 전면 범퍼는 기존 형식이나 에어 인테이크 일부가 변경되어 패널이 좀 더 부드럽게 바뀌었고, 에어 인테이크가 추가되면서 범퍼가 GV70과 비슷한 형상으로 바뀌었다. 후면부는 사실상 거의 변화가 없었고 범퍼도 파워트레인 분류 전부 히트인슐레이터로 변경해 힘이 가볍게 돌아간다. 외장 컬러는 스톤 그린이 추가된 12종류 색상으로 운영한다.차가 정말 동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동동023년 9월 27일 정식 공개되었으며, 10월 11일부터 판매를 시작한다. 현대미가가 비레스모델이 크게 바뀌는 것과 달리 전체적인 외관 디자인의 큰 변화는 없으나, 헤드램프는 G90·RS4에 들어간 벽조형 블레이드 타입으로 바뀌었고, 크레스트 그릴은 조형 메쉬 구조로 다듬었으며, 가로 패턴이 적용된 신규 알루미늄 림이 추가되었다. 범퍼, 옆[옆] 등 디테일도 약간 수정해 완성도를 높였다. 기존 GV80 전면 범퍼는범퍼는 기존 형식이나 에어 인테이크 일부가 변경되어 패널이 좀 더 부드럽게 바뀌었고, 에어 인테이크가 추가되면서 범퍼가 GV70과 비슷한 형상으로 바뀌었다. 후면부는 사실상 거의 변화가 없었고 범퍼도 파워트레인 분류 전부 히트인슐레이터로 변경해 힘이 가볍게 돌아간다. 외장 컬러는 스톤 그린이 추가된 12종류 색상으로 운영한다.`;

    return (
        <Container $ismobile={isMobile}>
            {/* 카테고리 */}
            <Category $ismobile={isMobile}>시승 후기</Category>

            {/* 제목 */}
            <Title $ismobile={isMobile}>
                2023 GV80 디젤 3.0 AWD 6인승 디자인 후기~~~
            </Title>

            {/* 메타 정보(작성자/날짜 + 조회수) */}
            <MetaRow $ismobile={isMobile}>
                <AuthorRow>
                    <Avatar src={userAvatar} alt="작성자" $ismobile={isMobile} />
                    <AuthorInfo $ismobile={isMobile}>
                        <span>{author}님,</span>
                        <span>{date}</span>
                    </AuthorInfo>
                </AuthorRow>
                <ViewCount $ismobile={isMobile}>조회수 {views}</ViewCount>
            </MetaRow>

            {/* 구분선 */}
            <Divider $ismobile={isMobile} />

            {/* 본문 */}
            <Paragraph $ismobile={isMobile}>{bodyText}</Paragraph>

            {/* 구분선 */}
            <Divider $ismobile={isMobile} />

            {/* 좋아요 & 댓글 액션 */}
            <ActionContainer $ismobile={isMobile}>
                <ActionButton $ismobile={isMobile}>
                    <img src={likeIcon} alt="좋아요" />
                    47
                </ActionButton>
                <ActionButton $ismobile={isMobile}>
                    <img src={commentIcon} alt="댓글" />
                    99+
                </ActionButton>
            </ActionContainer>
        </Container>
    );
};

export default ArticleView;
