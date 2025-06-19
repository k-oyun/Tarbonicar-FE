import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Alignment, Autoformat, AutoImage, AutoLink, Autosave,
    BlockQuote, Bold, Bookmark, Code, CodeBlock, Emoji, Essentials,
    FindAndReplace, FontBackgroundColor, FontColor, FontFamily, FontSize,
    FullPage, Fullscreen, GeneralHtmlSupport, Heading, Highlight,
    HorizontalLine, HtmlComment, HtmlEmbed, ImageBlock, ImageCaption,
    ImageInline, ImageInsert, ImageInsertViaUrl, ImageResize, ImageStyle,
    ImageTextAlternative, ImageToolbar, ImageUpload, Indent, IndentBlock,
    Italic, Link, LinkImage, List, ListProperties, Markdown, MediaEmbed,
    Mention, PageBreak, Paragraph, PasteFromMarkdownExperimental,
    PasteFromOffice, PlainTableOutput, RemoveFormat, ShowBlocks,
    SourceEditing, SpecialCharacters, SpecialCharactersArrows,
    SpecialCharactersCurrency, SpecialCharactersEssentials,
    SpecialCharactersLatin, SpecialCharactersMathematical,
    SpecialCharactersText, Strikethrough, Style, Subscript, Superscript,
    Table, TableCaption, TableCellProperties, TableColumnResize,
    TableLayout, TableProperties, TableToolbar,
    TextTransformation, TodoList, Underline, DragDrop
} from 'ckeditor5';

import translations from 'ckeditor5/translations/ko.js';
import 'ckeditor5/ckeditor5.css';

import styled, { createGlobalStyle } from "styled-components";
import { useMediaQuery } from "react-responsive";

const HEADER_DESKTOP = 80;
const HEADER_MOBILE  = 60;
const MOBILE_MAX     = '767px';
const LICENSE_KEY    = 'GPL';

const CKEDITOR_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Oswald&family=Lato:wght@300;400;700&display=swap');
.ck-content { font-family:'Lato',sans-serif; line-height:1.6; word-break:break-word; }
`;

const GlobalStyle = createGlobalStyle`
    body { font-family:'Lato',sans-serif; }
    @media (max-width: ${MOBILE_MAX}) {
        .ck-toolbar {
            position: sticky !important;
            top: ${HEADER_MOBILE}px !important;
            z-index: 1000;
        }
    }
`;

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
    font-size: 28px; font-weight:700; color:#444;
    border:none; border-bottom:2px solid #e0e0e0;
    padding:8px 0; margin-bottom:24px; outline:none;
    &::placeholder { color:#bdbdbd; }
    @media (max-width:${MOBILE_MAX}) {
        font-size:20px; margin-bottom:16px;
    }
`;
const Controls = styled.div`
    display:flex; gap:16px; flex-wrap:wrap; justify-content:flex-end;
    margin-bottom:16px;
    @media (max-width:${MOBILE_MAX}) {
        flex-direction:column; align-items:stretch; gap:8px; margin-bottom:12px;
    }
`;
const SelectBox = styled.select`
    min-width:120px; padding:10px 12px;
    border:1px solid #cfd8dc; border-radius:4px;
    background:#fff; font-size:14px; color:#424242; cursor:pointer;
    @media (max-width:${MOBILE_MAX}) {
        width:100%; min-width:unset;
    }
`;
const SubmitBtn = styled.button`
    background:#002c5f; color:#fff;
    font-size:16px; font-weight:600;
    padding:12px 32px; border-radius:6px; border:none; cursor:pointer;
    &:hover { background:#073b8d; }
    @media (max-width:${MOBILE_MAX}) {
        padding:10px 20px; font-size:14px;
    }
`;
const EditorWrapper = styled.div`
    position:relative; z-index:0;
    width:100%;
    border:1px solid #cfd8dc; border-radius:2px;
    .ck-editor * { overflow-x: visible !important; }
    .ck-editor__editable_inline {
        min-height:500px;
        @media (max-width:${MOBILE_MAX}) {
            min-height:300px;
        }
    }
`;

// Custom Upload Adapter 클래스
class CustomUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    // 이미지 업로드 로직
    upload() {
        return this.loader.file
            .then(file => {
                const formData = new FormData();
                formData.append('image', file);

                return fetch('http://localhost:8080/api/v1/s3/upload-image', {
                    method: 'POST',
                    body: formData
                })
                    .then(res => res.json())
                    .then(json => {
                        if (!json.success) {
                            return Promise.reject(json.message);
                        }
                        // 서버에서 응답받은 data(이미지 URL) 값 반환
                        return { default: json.data };
                    });
            });
    }

    abort() {
        // 업로드 취소 로직
    }
}

// 2) 플러그인으로 어댑터 등록
function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = loader => {
        return new CustomUploadAdapter(loader);
    };
}

export default function ArticleWrite() {
    const editorRef = useRef(null);
    const [ready, setReady] = useState(false);

    // 셀렉트 상태
    const [category, setCategory] = useState('');
    const [carTypes, setCarTypes] = useState([]);
    const [selectedCarType, setSelectedCarType] = useState('');
    const [carNames, setCarNames] = useState([]);
    const [selectedCarName, setSelectedCarName] = useState('');
    const [carAges, setCarAges] = useState([]);
    const [selectedCarAge, setSelectedCarAge] = useState('');

    // 모바일 감지
    const isMobile = useMediaQuery({ query: `(max-width: ${MOBILE_MAX})` });
    const headerHeight = isMobile ? HEADER_MOBILE : HEADER_DESKTOP;
    const wrapperTop = headerHeight + 20;
    const toolbarOffset = headerHeight;

    // CKEditor 전용 CSS 삽입
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = CKEDITOR_CSS;
        document.head.appendChild(style);
        setReady(true);
        return () => document.head.removeChild(style);
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
                    ShowBlocks, SourceEditing, SpecialCharacters, SpecialCharactersArrows,
                    SpecialCharactersCurrency, SpecialCharactersEssentials,
                    SpecialCharactersLatin, SpecialCharactersMathematical,
                    SpecialCharactersText, Strikethrough, Style, Subscript, Superscript,
                    Table, TableCaption, TableCellProperties, TableColumnResize,
                    TableLayout, TableProperties, TableToolbar,
                    TextTransformation, TodoList, Underline, DragDrop
                ],
                extraPlugins: [ CustomUploadAdapterPlugin ], // 커스텀 업로드 어댑터 플러그인 등록
                language: 'ko',
                placeholder: '내용을 입력하세요.',
                translations: [translations],
                licenseKey: LICENSE_KEY
            }
        };
    }, [ready, toolbarOffset]);

    // 차종 목록 조회
    useEffect(() => {
        fetch('http://localhost:8080/api/v1/category/search/cartype')
            .then(res => res.json())
            .then(json => setCarTypes(json.data || []))
            .catch(err => console.error(err));
    }, []);

    // 차종 선택 시 차량 목록 조회
    useEffect(() => {
        if (!selectedCarType) {
            setCarNames([]); setSelectedCarName(''); setCarAges([]); setSelectedCarAge('');
            return;
        }
        fetch(`http://localhost:8080/api/v1/category/search/carname?carType=${encodeURIComponent(selectedCarType)}`)
            .then(res => res.json())
            .then(json => setCarNames(json.data || []))
            .catch(err => console.error(err));
    }, [selectedCarType]);

    // 차량 선택 시 연식 목록 조회
    useEffect(() => {
        if (!selectedCarName) {
            setCarAges([]); setSelectedCarAge('');
            return;
        }
        fetch(`http://localhost:8080/api/v1/category/search/carage?carName=${encodeURIComponent(selectedCarName)}`)
            .then(res => res.json())
            .then(json => setCarAges(json.data || []))
            .catch(err => console.error(err));
    }, [selectedCarName]);

    return (
        <>
            <GlobalStyle/>

            <PageWrap $top={wrapperTop}>
                <ActionBar>
                    <SubmitBtn>작성하기</SubmitBtn>
                </ActionBar>

                <TitleInput placeholder="제목을 입력하세요."/>

                <Controls>
                    <SelectBox value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">카테고리</option>
                        <option value="REVIEW">리뷰</option>
                        <option value="TESTDRIVE">시승</option>
                        <option value="TIP">TIP</option>
                    </SelectBox>

                    <SelectBox value={selectedCarType} onChange={e => setSelectedCarType(e.target.value)}>
                        <option value="">차종</option>
                        {carTypes.map(type => (
                            <option key={type.id} value={type.carType}>{type.carType}</option>
                        ))}
                    </SelectBox>

                    <SelectBox
                        value={selectedCarName}
                        onChange={e => setSelectedCarName(e.target.value)}
                        disabled={!selectedCarType}
                    >
                        <option value="">차량</option>
                        {carNames.map(name => (
                            <option key={name.id} value={name.carName}>{name.carName}</option>
                        ))}
                    </SelectBox>

                    <SelectBox
                        value={selectedCarAge}
                        onChange={e => setSelectedCarAge(e.target.value)}
                        disabled={!selectedCarName}
                    >
                        <option value="">연식</option>
                        {carAges.map(age => (
                            <option key={age.id} value={age.carAge}>{age.carAge}년식</option>
                        ))}
                    </SelectBox>
                </Controls>

                <EditorWrapper ref={editorRef}>
                    {editorConfig && (
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
