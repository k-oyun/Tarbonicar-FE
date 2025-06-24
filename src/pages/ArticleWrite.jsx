import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Alignment, Autoformat, AutoImage, AutoLink, Autosave, BlockQuote, Bold, Bookmark,
    Code, CodeBlock, Emoji, Essentials, FindAndReplace, FontBackgroundColor, FontColor, FontFamily,
    FontSize, FullPage, Fullscreen, GeneralHtmlSupport, Heading, Highlight, HorizontalLine, HtmlComment,
    HtmlEmbed, ImageBlock, ImageCaption, ImageInline, ImageInsert, ImageInsertViaUrl, ImageResize,
    ImageStyle, ImageTextAlternative, ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link,
    LinkImage, List, ListProperties, MediaEmbed, Mention, PageBreak, Paragraph, PasteFromOffice,
    PlainTableOutput, RemoveFormat, ShowBlocks, SourceEditing, SpecialCharacters,
    SpecialCharactersArrows, SpecialCharactersCurrency, SpecialCharactersEssentials,
    SpecialCharactersLatin, SpecialCharactersMathematical, SpecialCharactersText, Strikethrough,
    Style, Subscript, Superscript, Table, TableCaption, TableCellProperties, TableColumnResize,
    TableLayout, TableProperties, TableToolbar, TextTransformation, TodoList, Underline, DragDrop
} from 'ckeditor5';

import translations from 'ckeditor5/translations/ko.js';
import 'ckeditor5/ckeditor5.css';

import styled, { createGlobalStyle } from "styled-components";
import { useMediaQuery } from "react-responsive";
import SelectBox      from "../components/SelectBox";
import ConfirmDialog  from "../components/ConfirmDialog";
import { articleApi } from "../api/articleApi.js";
import { categoryApi } from "../api/categoryApi.js";
import { imageUploadApi } from "../api/imageUploadApi.js";

const HEADER_DESKTOP = 80;
const HEADER_MOBILE  = 60;
const MOBILE_MAX     = '767px';
const LICENSE_KEY    = 'GPL';

// 전역 스타일
const GlobalStyle = createGlobalStyle`
    body { font-family:'Lato',sans-serif; }
    @media (max-width:${MOBILE_MAX}) {
        .ck-toolbar { position:sticky !important; top:${HEADER_MOBILE}px !important; z-index:1000; }
    }
`;

const PageWrap = styled.div`
    max-width:1180px; margin:0 auto 40px;
    padding:${({$top})=>$top}px 16px 0;
    @media (max-width:${MOBILE_MAX}){padding:${({$top})=>$top}px 8px 0; margin-bottom:20px;}
`;

const ActionBar = styled.div`display:flex; justify-content:flex-end; margin-bottom:16px;`;

const TitleInput = styled.input`
    width:100%; font-size:28px; font-weight:700; color:#444;
    border:none; border-bottom:2px solid #e0e0e0; padding:8px 0; margin-bottom:10px;
    &::placeholder{color:#bdbdbd;}
    @media (max-width:${MOBILE_MAX}){font-size:20px; margin-bottom:16px;}
`;

const Controls = styled.div`
    position:relative; z-index:2000; display:flex; flex-direction:column; gap:16px; margin-bottom:16px;
    @media (max-width:${MOBILE_MAX}){gap:8px; margin-bottom:12px;}
`;

const SelectsContainer = styled.div`
    display:flex; width:100%; height:${p=>p.$isOpen?"1000px":"55px"};
    justify-content:flex-end; position:absolute; top:0; gap:5px; padding:20px; margin:-20px;
`;

const SubmitBtn = styled.button`
    background:#002c5f; color:#fff; font-size:16px; font-weight:600;
    padding:12px 32px; border-radius:6px; border:none; cursor:pointer;
    &:hover{background:#073b8d;}
    @media (max-width:${MOBILE_MAX}){padding:10px 20px; font-size:14px;}
`;

const EditorWrapper = styled.div`
    position:relative; z-index:-100; width:99.9%;
    margin-top:70px; border:1px solid #cfd8dc; border-radius:2px;
    .ck-editor *{overflow-x:visible !important;}
    .ck-editor__editable_inline{min-height:500px; @media(max-width:${MOBILE_MAX}){min-height:300px;}}
`;

export default function ArticleWrite() {

    const { getArticleApi, postArticleApi, updateArticleApi } = articleApi();
    const { postImageUploadApi } = imageUploadApi();
    const { carTypeListApi, carNameListApi, carAgeListApi } = categoryApi();

    const editorRef = useRef(null);
    const [ready, setReady] = useState(false);

    // URL query 의 id 파라미터
    const articleId = useMemo(
        () => new URLSearchParams(window.location.search).get("id"),
        []
    );

    // 입력 상태
    const [title, setTitle]       = useState('');
    const [content, setContent]   = useState('');
    const [category, setCategory] = useState('');

    // 차종, 차량, 연식
    const [carTypes, setCarTypes]               = useState([]);
    const [selectedCarType, setSelectedCarType] = useState('');
    const [carNames, setCarNames]               = useState([]);
    const [selectedCarName, setSelectedCarName] = useState('');
    const [carAges, setCarAges]                 = useState([]);
    const [selectedCarAge, setSelectedCarAge]   = useState('');

    const [dialog, setDialog] = useState({ isOpen:false });

    // 반응형 계산
    const isMobile      = useMediaQuery({ query:`(max-width:${MOBILE_MAX})` });
    const headerHeight  = isMobile ? HEADER_MOBILE : HEADER_DESKTOP;
    const wrapperTop    = headerHeight + 20;
    const toolbarOffset = headerHeight;
    const selectWidth   = isMobile ? "100px" : "110px";  // 수정: PC/모바일에 따라 width 지정

    // 에디터 폰트 적용
    useEffect(()=>{
        const style=document.createElement('style');
        style.textContent=".ck-content{font-family:'Lato',sans-serif; line-height:1.6; word-break:break-word}";
        document.head.appendChild(style);
        setReady(true);
        return()=>document.head.removeChild(style);
    },[]);

    // 이미지 업로드 어댑터
    function CustomUploadAdapterPlugin(editor){
        editor.plugins.get('FileRepository').createUploadAdapter = loader => new CustomUploadAdapter(loader);
    }
    class CustomUploadAdapter{
        constructor(loader){this.loader=loader;}
        upload(){
            return this.loader.file.then(file=>{
                const fd=new FormData(); fd.append('image',file);
                return postImageUploadApi(fd).then(res=>{
                    const j=res.data; if(!j.success) return Promise.reject(j.message);
                    return {default:j.data};
                });
            });
        }
        abort(){}
    }

    // CKEditor 설정
    const editorConfig = useMemo(() => {
        if (!ready) return null;
        return {
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
                Alignment,Autoformat,AutoImage,AutoLink,Autosave,BlockQuote,Bold,Bookmark,Code,CodeBlock,
                Emoji,Essentials,FindAndReplace,FontBackgroundColor,FontColor,FontFamily,FontSize,FullPage,
                Fullscreen,GeneralHtmlSupport,Heading,Highlight,HorizontalLine,HtmlComment,HtmlEmbed,
                ImageBlock,ImageCaption,ImageInline,ImageInsert,ImageInsertViaUrl,ImageResize,ImageStyle,
                ImageTextAlternative,ImageToolbar,ImageUpload,Indent,IndentBlock,Italic,Link,LinkImage,List,
                ListProperties,MediaEmbed,Mention,PageBreak,Paragraph,PasteFromOffice,PlainTableOutput,
                RemoveFormat,ShowBlocks,SourceEditing,SpecialCharacters,SpecialCharactersArrows,
                SpecialCharactersCurrency,SpecialCharactersEssentials,SpecialCharactersLatin,
                SpecialCharactersMathematical,SpecialCharactersText,Strikethrough,Style,Subscript,
                Superscript,Table,TableCaption,TableCellProperties,TableColumnResize,TableLayout,
                TableProperties,TableToolbar,TextTransformation,TodoList,Underline,DragDrop
            ],
            extraPlugins: [ CustomUploadAdapterPlugin ],
            language: 'ko',
            placeholder: '내용을 입력하세요.',
            translations: [ translations ],
            licenseKey: LICENSE_KEY
        };
    }, [ready, toolbarOffset]);

    // 편집 모드: 기존 데이터 로딩
    useEffect(() => {
        if (!articleId) return;
        getArticleApi(articleId)
            .then(res => {
                if (res.data.success) {
                    const d = res.data.data;
                    setTitle(d.title);
                    setContent(d.content);
                    setCategory(d.articleType);
                    setSelectedCarType(d.carType);
                    setSelectedCarName(d.carName);

                    // 수정: 연식 목록 받아오고, 서버의 carAge(년도)와 매칭되는 id로 설정
                    carAgeListApi(d.carName)
                        .then(r => {
                            const ages = r.data.data || [];
                            setCarAges(ages);
                            const matched = ages.find(a => a.carAge === d.carAge);
                            if (matched) setSelectedCarAge(matched.id);
                        })
                        .catch(console.error);
                }
            })
            .catch(console.error);
    }, [articleId]);

    // 데이터 로딩 (카테고리)
    useEffect(()=>{ carTypeListApi().then(r => setCarTypes(r.data.data || [])) },[]);
    useEffect(()=>{
        if(!selectedCarType){
            setCarNames([]); setSelectedCarName(''); setCarAges([]); setSelectedCarAge(''); return;
        }
        carNameListApi(selectedCarType).then(r=>setCarNames(r.data.data||[])).catch(console.error);
    },[selectedCarType]);
    useEffect(()=>{
        if(!selectedCarName){ setCarAges([]); setSelectedCarAge(''); return; }
        carAgeListApi(selectedCarName).then(r=>setCarAges(r.data.data||[])).catch(console.error);
    },[selectedCarName]);

    // 모달 호출 헬퍼
    const openDialog = ({title,message="",showCancel=false,isRedButton=false,onConfirm})=>{
        setDialog({
            isOpen:true,
            title,
            message,
            showCancel,
            isRedButton,
            onConfirm: onConfirm || (()=>setDialog({isOpen:false})),
            onCancel : ()=>setDialog({isOpen:false})
        });
    };

    // 작성/수정 처리
    const handleSubmit = () => {
        if(!title.trim())              { openDialog({title:"제목을 입력하세요"});          return; }
        if(!category)                  { openDialog({title:"카테고리를 선택하세요"});      return; }
        if(!selectedCarType)           { openDialog({title:"차종을 선택하세요"});          return; }
        if(!selectedCarName)           { openDialog({title:"차량을 선택하세요"});          return; }
        if(!selectedCarAge)            { openDialog({title:"연식을 선택하세요"});          return; }
        if(!content.trim() || content.trim()==='<p><br></p>'){
            openDialog({title:"내용을 입력하세요"});                                        return;
        }

        const payload = {
            title,
            content,
            articleType: category,
            categoryId: Number(selectedCarAge),
        };
        if (articleId) {
            payload.articleId = Number(articleId);
            updateArticleApi(payload)
                .then(() => {
                    openDialog({
                        title:"게시글이 수정되었습니다.",
                        onConfirm: ()=>window.location.replace(`/article-view?id=${articleId}`)
                    });
                })
                .catch(()=>openDialog({
                    title:"수정 실패",
                    message:"잠시 후 다시 시도해 주세요.",
                    isRedButton:true
                }));
        } else {
            postArticleApi(payload)
                .then(res=>{
                    const newId = res.data?.data?.id ?? res.data?.data;
                    openDialog({
                        title:"게시글이 등록되었습니다.",
                        onConfirm:()=>window.location.replace(`/article-view?id=${newId}`)
                    });
                })
                .catch(()=>openDialog({
                    title:"등록 실패",
                    message:"잠시 후 다시 시도해 주세요.",
                    isRedButton:true
                }));
        }
    };

    // 드롭다운 열림/닫힘
    const [isOpen,setIsOpen]=useState(false);
    const selectRef = useRef(null);
    useEffect(()=>{
        const h=e=>{ if(selectRef.current && !selectRef.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener('mousedown',h); return()=>document.removeEventListener('mousedown',h);
    },[]);
    const handleSelectBox = () => setIsOpen(true);
    useEffect(()=>setIsOpen(false),
        [selectedCarName,selectedCarType,selectedCarAge,category]);

    // 비활성화 조건
    const vehicleDisabled = !selectedCarType;
    const ageDisabled     = !selectedCarType || !selectedCarName;

    return (
        <>
            <GlobalStyle/>

            <PageWrap $top={wrapperTop}>
                <ActionBar>
                    <SubmitBtn onClick={handleSubmit}>
                        {articleId ? '수정하기' : '작성하기'}
                    </SubmitBtn>
                </ActionBar>

                <TitleInput placeholder="제목을 입력하세요." value={title} onChange={e=>setTitle(e.target.value)} />

                <Controls>
                    <SelectsContainer $isOpen={isOpen} ref={selectRef}>
                        <SelectBox
                            options={[{value:'REVIEW',label:'리뷰'},{value:'TESTDRIVE',label:'시승'},{value:'TIP',label:'TIP'}]}
                            placeholder="카테고리"
                            value={category}
                            onSelect={setCategory}
                            isSelected={category}
                            onClick={handleSelectBox}
                            width={selectWidth}
                        />

                        <SelectBox
                            options={carTypes.map(c=>({value:c.carType,label:c.carType}))}
                            placeholder="차종"
                            value={selectedCarType}
                            onSelect={setSelectedCarType}
                            isSelected={selectedCarType}
                            onClick={handleSelectBox}
                            width={selectWidth}
                        />

                        <SelectBox
                            options={vehicleDisabled?[]:carNames.map(c=>({value:c.carName,label:c.carName}))}
                            placeholder="차량"
                            value={selectedCarName}
                            onSelect={setSelectedCarName}
                            isSelected={selectedCarName}
                            disabled={vehicleDisabled}
                            onClick={vehicleDisabled?undefined:handleSelectBox}
                            width={selectWidth}
                        />

                        <SelectBox
                            options={ageDisabled?[]:carAges.map(a=>({value:a.id,label:`${a.carAge}년식`}))}
                            placeholder="연식"
                            value={selectedCarAge}
                            onSelect={setSelectedCarAge}
                            isSelected={selectedCarAge}
                            disabled={ageDisabled}
                            onClick={ageDisabled?undefined:handleSelectBox}
                            width={selectWidth}
                        />
                    </SelectsContainer>

                    <EditorWrapper ref={editorRef}>
                        {editorConfig && (
                            <CKEditor
                                editor={ClassicEditor}
                                config={editorConfig}
                                onChange={(e,ed)=>setContent(ed.getData())}
                                data={content}
                            />
                        )}
                    </EditorWrapper>
                </Controls>
            </PageWrap>

            <ConfirmDialog
                isOpen      ={dialog.isOpen}
                title       ={dialog.title}
                message     ={dialog.message}
                showCancel  ={dialog.showCancel}
                isRedButton ={dialog.isRedButton}
                onConfirm   ={dialog.onConfirm}
                onCancel    ={dialog.onCancel}
            />
        </>
    );
}
