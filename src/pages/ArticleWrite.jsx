import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Alignment, Autoformat, AutoImage, AutoLink, Autosave,
    BlockQuote, Bold, Bookmark, Code, CodeBlock,
    Emoji, Essentials, FindAndReplace,
    FontBackgroundColor, FontColor, FontFamily, FontSize,
    FullPage, Fullscreen, GeneralHtmlSupport, Heading, Highlight,
    HorizontalLine, HtmlComment, HtmlEmbed,
    ImageBlock, ImageCaption, ImageInline, ImageInsert, ImageInsertViaUrl,
    ImageResize, ImageStyle, ImageTextAlternative, ImageToolbar, ImageUpload,
    Indent, IndentBlock, Italic, Link, LinkImage,
    List, ListProperties, Markdown, MediaEmbed, Mention,
    PageBreak, Paragraph, PasteFromMarkdownExperimental, PasteFromOffice,
    PlainTableOutput, RemoveFormat, ShowBlocks, SimpleUploadAdapter, SourceEditing,
    SpecialCharacters, SpecialCharactersArrows, SpecialCharactersCurrency,
    SpecialCharactersEssentials, SpecialCharactersLatin, SpecialCharactersMathematical,
    SpecialCharactersText, Strikethrough, Style, Subscript, Superscript,
    Table, TableCaption, TableCellProperties, TableColumnResize,
    TableLayout, TableProperties, TableToolbar,
    TextTransformation, TodoList, Underline
} from 'ckeditor5';

import translations from 'ckeditor5/translations/ko.js';
import 'ckeditor5/ckeditor5.css';

import styled, { createGlobalStyle } from 'styled-components';
import { useMediaQuery } from 'react-responsive';

// 헤더 높이 상수
const HEADER_DESKTOP = 80;
const HEADER_MOBILE  = 60;

// 모바일 브레이크포인트
const MOBILE_MAX = '767px';

// CKEditor 전용 CSS
const CKEDITOR_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Oswald&family=Lato:wght@300;400;700&display=swap');

.ck-content {
  font-family:'Lato',sans-serif;
  line-height:1.6;
  word-break:break-word;
}

/* (기존 스타일 생략) */
`;

// GlobalStyle : 전역 폰트 + 모바일 sticky toolbar
const GlobalStyle = createGlobalStyle`
  body {
    font-family:'Lato',sans-serif;
  }

  // 모바일에서 에디터 툴바가 헤더 바로 아래에 붙도록 sticky
  @media (max-width: ${MOBILE_MAX}) {
    .ck-toolbar {
      position: sticky !important;
      top: ${HEADER_MOBILE}px !important;
      z-index: 1000;
    }
  }
`;

// 레이아웃 컴포넌트
const PageWrap = styled.div`
    max-width: 1180px;
    margin: 0 auto 40px;
    padding: ${({ $top }) => $top}px 16px 0;

    @media (max-width: ${MOBILE_MAX}) {
        padding: ${({ $top }) => $top}px 8px 0;
        margin-bottom: 20px;
    }
`;

const ActionBar = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
`;

const TitleInput = styled.input`
    width: 100%;
    font-size: 28px;
    font-weight: 700;
    color: #444;
    border: none;
    border-bottom: 2px solid #e0e0e0;
    padding: 8px 0;
    margin-bottom: 24px;
    outline: none;

    &::placeholder { color: #bdbdbd; }

    @media (max-width: ${MOBILE_MAX}) {
        font-size: 20px;
        margin-bottom: 16px;
    }
`;

const Controls = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: flex-end;
    margin-bottom: 16px;

    @media (max-width: ${MOBILE_MAX}) {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        margin-bottom: 12px;
    }
`;

const SelectBox = styled.select`
    min-width: 120px;
    padding: 10px 12px;
    border: 1px solid #cfd8dc;
    border-radius: 4px;
    background: #fff;
    font-size: 14px;
    color: #424242;
    cursor: pointer;

    @media (max-width: ${MOBILE_MAX}) {
        width: 100%;
        min-width: unset;
    }
`;

const SubmitBtn = styled.button`
    background: #002c5f;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 32px;
    border-radius: 6px;
    border: none;
    cursor: pointer;

    &:hover { background: #073b8d; }

    @media (max-width: ${MOBILE_MAX}) {
        padding: 10px 20px;
        font-size: 14px;
    }
`;

const EditorWrapper = styled.div`
    position: relative;
    z-index: 0;
    width: 100%;
    border: 1px solid #cfd8dc;
    border-radius: 2px;

    .ck-editor * {
        overflow-x: visible !important;
    }

    // 에디터 본문 최소 높이
    .ck-editor__editable_inline {
        min-height: 500px;

        @media (max-width: ${MOBILE_MAX}) {
            min-height: 300px;
        }
    }
`;

const LICENSE_KEY = 'GPL';   // 오픈소스 라이선스 키

export default function ArticleWrite() {
    const editorRef = useRef(null);
    const [ready, setReady] = useState(false);

    // 모바일 여부로 헤더 높이 결정
    const isMobile      = useMediaQuery({ query: `(max-width: ${MOBILE_MAX})` });
    const headerHeight  = isMobile ? HEADER_MOBILE : HEADER_DESKTOP;
    const wrapperTopPad = headerHeight + 20;  // 상단 패딩
    const toolbarOffset = headerHeight;       // CKEditor viewportTopOffset

    // CKEditor 전용 CSS 삽입
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = CKEDITOR_CSS;
        document.head.appendChild(style);
        setReady(true);
        return () => { document.head.removeChild(style); };
    }, []);

    // CKEditor 설정
    const { editorConfig } = useMemo(() => {
        if (!ready) return {};

        return {
            editorConfig: {
                toolbar: {
                    items: [
                        'undo','redo','|','sourceEditing','showBlocks','findAndReplace','fullscreen','|',
                        'heading','style','|','fontSize','fontFamily','fontColor','fontBackgroundColor','|',
                        'bold','italic','underline','strikethrough','subscript','superscript',
                        'code','removeFormat','|','emoji','specialCharacters','horizontalLine','pageBreak',
                        'link','bookmark','insertImage','mediaEmbed','insertTable','insertTableLayout',
                        'highlight','blockQuote','codeBlock','htmlEmbed','|','alignment','|',
                        'bulletedList','numberedList','todoList','outdent','indent'
                    ],
                    viewportTopOffset: toolbarOffset,
                    shouldNotGroupWhenFull: false
                },
                plugins: [
                    Alignment, Autoformat, AutoImage, AutoLink, Autosave, BlockQuote, Bold, Bookmark,
                    Code, CodeBlock, Emoji, Essentials, FindAndReplace, FontBackgroundColor, FontColor,
                    FontFamily, FontSize, FullPage, Fullscreen, GeneralHtmlSupport, Heading, Highlight,
                    HorizontalLine, HtmlComment, HtmlEmbed, ImageBlock, ImageCaption, ImageInline,
                    ImageInsert, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative,
                    ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link, LinkImage, List,
                    ListProperties, Markdown, MediaEmbed, Mention, PageBreak, Paragraph,
                    PasteFromMarkdownExperimental, PasteFromOffice, PlainTableOutput, RemoveFormat,
                    ShowBlocks, SimpleUploadAdapter, SourceEditing, SpecialCharacters,
                    SpecialCharactersArrows, SpecialCharactersCurrency, SpecialCharactersEssentials,
                    SpecialCharactersLatin, SpecialCharactersMathematical, SpecialCharactersText,
                    Strikethrough, Style, Subscript, Superscript, Table, TableCaption,
                    TableCellProperties, TableColumnResize, TableLayout, TableProperties,
                    TableToolbar, TextTransformation, TodoList, Underline
                ],
                language: 'ko',
                placeholder: '내용을 입력하세요.',
                translations: [translations],
                licenseKey: LICENSE_KEY
            }
        };
    }, [ready, toolbarOffset]);

    return (
        <>
            <GlobalStyle/>

            <PageWrap $top={wrapperTopPad}>
                <ActionBar>
                    <SubmitBtn>작성하기</SubmitBtn>
                </ActionBar>

                <TitleInput placeholder="제목을 입력하세요."/>

                <Controls>
                    <SelectBox defaultValue="">
                        <option disabled>카테고리</option>
                        <option>리뷰</option>
                        <option>시승</option>
                        <option>TIP</option>
                    </SelectBox>
                    <SelectBox defaultValue="">
                        <option disabled>차종</option>
                        <option>SUV</option>
                        <option>세단</option>
                        <option>EV</option>
                    </SelectBox>
                    <SelectBox defaultValue="">
                        <option disabled>차량</option>
                        <option>GV60</option>
                        <option>GV70</option>
                        <option>GV80</option>
                    </SelectBox>
                    <SelectBox defaultValue="">
                        <option disabled>연식</option>
                        <option>22년식</option>
                        <option>23년식</option>
                        <option>24년식</option>
                    </SelectBox>
                </Controls>

                <EditorWrapper ref={editorRef}>
                    { editorConfig && (
                        <CKEditor
                            editor={ClassicEditor}
                            config={editorConfig}
                        />
                    )}
                </EditorWrapper>
            </PageWrap>
        </>
    );
}
