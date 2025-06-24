import React, {forwardRef, useEffect, useRef, useState} from "react";
import { categoryApi } from "../api/categoryApi.js";
import * as Accordion from "@radix-ui/react-accordion";
import {ChevronDownIcon} from "@radix-ui/react-icons";
import styled, {keyframes} from "styled-components";
import refresh from "../assets/Svgs/refresh.svg";
import CheckboxGroup from "./CheckboxGroup.jsx";
import {DropdownBox} from "./DropdownBox.jsx";

const FilterContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 0 15px;
`;

const FilterTitle = styled.span`
    font-size: 18px;
    font-weight: bold;
`;

const ResetButton = styled.button`
    all: unset;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #888;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

const RefreshIcon = styled.img`
    width: 14px;
    height: 14px;
`;

const AccordionRoot = styled(Accordion.Root)`
    border-radius: 6px;
    width: auto;
    margin: 10px;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
`;

const AccordionItem = styled(Accordion.Item)`
    overflow: hidden;
    margin-top: 1px;

    &:first-child {
        margin-top: 0;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }

    &:last-child {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }

    &:focus-within {
        position: relative;
        z-index: 1;
        box-shadow: 0 0 0 1px #E9EAEC;
    }
`;

const AccordionHeader = styled(Accordion.Header)`
    display: flex;
`;

const AccordionTrigger = styled(Accordion.Trigger)`
    all: unset;
    font-family: inherit;
    background-color: white;
    padding: 0 20px;
    height: 45px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    line-height: 1;
    color: #444444;
    box-shadow: 0 1px 0 #e0e0e0;

    &:hover {
        background-color: #f5f5f5;
    }

    &[data-state="open"] > svg {
        transform: rotate(180deg);
    }
`;

const slideDown = keyframes`
    from {
        max-height: 0;
    }
    to {
        max-height: var(--radix-accordion-content-height);
    }
`;

const slideUp = keyframes`
    from {
        max-height: var(--radix-accordion-content-height);
    }
    to {
        max-height: 0;
    }
`;

const AccordionContent = styled(Accordion.Content)`
    overflow: hidden;
    font-size: 15px;
    color: #444444;
    display: flex;
    flex-direction: column;
    background-color: white;

    &[data-state="open"] {
        animation: ${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1);
    }

    &[data-state="closed"] {
        animation: ${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1);
    }
`;

const AccordionContentText = styled.div`
    padding: 15px 20px;
`;

const AccordionChevron = styled(ChevronDownIcon)`
    color: #444444;
    transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);
`;

const YearDropdownRow = styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
`;

const StyledDropdownBox = styled(DropdownBox)`
    flex: 1;
    min-width: 0;
`;

const CustomTrigger = forwardRef(({children, ...props}, ref) => (
    <AccordionHeader>
        <AccordionTrigger {...props} ref={ref}>
            {children}
            <AccordionChevron aria-hidden/>
        </AccordionTrigger>
    </AccordionHeader>
));

const CustomContent = forwardRef(({children, ...props}, ref) => (
    <AccordionContent {...props} ref={ref}>
        <AccordionContentText>{children}</AccordionContentText>
    </AccordionContent>
));

const CATEGORY_OPTIONS = [
    { label: "시승 후기", value: "TESTDRIVE" },
    { label: "차량 리뷰", value: "REVIEW" },
    { label: "차량 팁", value: "TIP" }
];

const ArticleFilter = ({ filters, setFilters }) => {
    const { carTypeListApi, carNameListApi, carAgeListHomeApi } = categoryApi();
    const [openItems, setOpenItems] = useState(["cartype", "carname", "carage", "category"]);

    const [carTypeList, setCarTypeList] = useState([]);
    const [carNameList, setCarNameList] = useState([]);
    const [carAgeList, setCarAgeList] = useState([]);

    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");

    // 최초 진입 플래그
    const isInit = useRef(true);

    // 차종 목록 패치 (최초)
    useEffect(() => {
        carTypeListApi()
            .then(res => setCarTypeList(res.data.data || []))
            .catch(console.error);
    }, []);

    // 차종 선택(혹은 초기 mount) 시 차량, 연식 fetch
    useEffect(() => {
        if (filters.carType) {
            carNameListApi(filters.carType)
                .then(res => setCarNameList(res.data.data || []))
                .catch(console.error);

            // 최초 진입(초기값 주입 시)에는 초기화하지 않음
            if (!isInit.current) {
                setFilters(prev => ({
                    ...prev,
                    carNames: [],
                    carAges: [],
                }));
                setStartYear("");
                setEndYear("");
            }

            setOpenItems(prev => [...new Set([...prev, "carname"])]);
        } else {
            setCarNameList([]);
            setCarAgeList([]);
            setFilters(prev => ({
                ...prev,
                carNames: [],
                carAges: [],
            }));
            setStartYear("");
            setEndYear("");
        }
        // eslint-disable-next-line
    }, [filters.carType, setFilters]);

    // 차량 선택(혹은 초기 mount) 시 연식 fetch
    useEffect(() => {
        if (filters.carType && filters.carNames.length > 0) {
            const carTypeParam = filters.carType;
            const carNameParam = filters.carNames[0];
            carAgeListHomeApi(carTypeParam, carNameParam)
                .then(res => setCarAgeList(res.data.data || []))
                .catch(console.error);

            // 최초 진입 아닐 때만 초기화
            if (!isInit.current) {
                setFilters(prev => ({
                    ...prev,
                    carAges: [],
                }));
                setStartYear("");
                setEndYear("");
            }

            setOpenItems(prev => [...new Set([...prev, "carage"])]);
        } else {
            setCarAgeList([]);
            setFilters(prev => ({
                ...prev,
                carAges: [],
            }));
            setStartYear("");
            setEndYear("");
        }
        // eslint-disable-next-line
    }, [filters.carType, filters.carNames, setFilters]);

    // ArticleFilter 컴포넌트 내부에 추가
    useEffect(() => {
        // carAgeList가 로드되고, filters.carAges에 값이 하나 있을 때만 초기화
        if (
            carAgeList.length > 0 &&
            filters.carAges &&
            filters.carAges.length === 1 &&
            startYear === "" && endYear === ""
        ) {
            const initYear = String(filters.carAges[0]);
            setStartYear(initYear);
            setEndYear(initYear);
        }
    }, [carAgeList, filters.carAges, startYear, endYear]);

    // 최초 마운트 후에는 플래그 false
    useEffect(() => {
        isInit.current = false;
    }, []);

    // 드롭다운 onChange
    const handleStartYearChange = e => {
        const newStart = typeof e === "string" ? e : e.target.value;
        // 전체(선택안함)이면 전체 범위
        if (!newStart && !endYear) {
            setStartYear("");
            setFilters(prev => ({ ...prev, carAges: [] }));
            return;
        }
        if (!newStart && endYear) {
            // 시작 전체, 종료만 선택 → oldest ~ 종료
            const oldest = carAgeList[carAgeList.length - 1]?.carAge;
            setStartYear("");
            if (oldest !== undefined) {
                const to = Number(endYear);
                const from = Math.min(Number(oldest), to);
                const range = Array.from({ length: to - from + 1 }, (_, i) => from + i);
                setFilters(prev => ({ ...prev, carAges: range }));
            }
            return;
        }

        // newStart만 있는 경우: 최신까지
        if (newStart && !endYear) {
            setStartYear(newStart);
            setEndYear("");
            const newest = carAgeList[0]?.carAge;
            if (newest !== undefined) {
                const from = Number(newStart);
                const to = Math.max(Number(newStart), Number(newest));
                const range = Array.from({ length: to - from + 1 }, (_, i) => from + i);
                setFilters(prev => ({ ...prev, carAges: range }));
            }
            return;
        }

        // newStart와 endYear 모두 선택됨
        if (newStart && endYear) {
            let from = Number(newStart);
            let to = Number(endYear);

            if (from > to) {
                // 시작 > 종료: 종료도 시작으로 맞춤
                setStartYear(newStart);
                setEndYear(newStart);
                setFilters(prev => ({ ...prev, carAges: [from] }));
            } else {
                setStartYear(newStart);
                // 정상 범위
                const range = Array.from({ length: to - from + 1 }, (_, i) => from + i);
                setFilters(prev => ({ ...prev, carAges: range }));
            }
        }
    };

    // 드롭다운 onChange
    const handleEndYearChange = e => {
        const newEnd = typeof e === "string" ? e : e.target.value;
        // 전체(선택안함)이면 전체 범위
        if (!startYear && !newEnd) {
            setEndYear("");
            setFilters(prev => ({ ...prev, carAges: [] }));
            return;
        }
        if (!startYear && newEnd) {
            // 시작 전체, 종료만 선택 → oldest ~ 종료
            const oldest = carAgeList[carAgeList.length - 1]?.carAge;
            setEndYear(newEnd);
            if (oldest !== undefined) {
                const to = Number(newEnd);
                const from = Math.min(Number(oldest), to);
                const range = Array.from({ length: to - from + 1 }, (_, i) => from + i);
                setFilters(prev => ({ ...prev, carAges: range }));
            }
            return;
        }
        if (startYear && !newEnd) {
            // 종료 전체 → 시작 ~ 최신
            setEndYear("");
            const newest = carAgeList[0]?.carAge;
            if (newest !== undefined) {
                const from = Number(startYear);
                const to = Math.max(Number(startYear), Number(newest));
                const range = Array.from({ length: to - from + 1 }, (_, i) => from + i);
                setFilters(prev => ({ ...prev, carAges: range }));
            }
            return;
        }
        if (startYear && newEnd) {
            let from = Number(startYear);
            let to = Number(newEnd);

            if (to < from) {
                // 종료 < 시작: 시작도 종료로 맞춤
                setStartYear(newEnd);
                setEndYear(newEnd);
                setFilters(prev => ({ ...prev, carAges: [to] }));
            } else {
                setEndYear(newEnd);
                // 정상 범위
                const range = Array.from({ length: to - from + 1 }, (_, i) => from + i);
                setFilters(prev => ({ ...prev, carAges: range }));
            }
        }
    };

    // 초기화 시 드롭다운도 초기화
    const handleReset = () => {
        setFilters({
            carType: "",
            carNames: [],
            carAges: [],
            articleTypes: [],
            sortType: "RECENT"
        });
        setStartYear("");
        setEndYear("");
    };

    return (
        <div>
            <FilterContainer>
                <FilterTitle>필터</FilterTitle>
                <ResetButton onClick={handleReset}>
                    <RefreshIcon src={refresh} alt="초기화 아이콘"/>
                    초기화
                </ResetButton>
            </FilterContainer>

            <AccordionRoot type="multiple" value={openItems} onValueChange={setOpenItems}>
                <AccordionItem value="cartype">
                    <CustomTrigger>차종</CustomTrigger>
                    <CustomContent>
                        {carTypeList.length > 0 ? (
                            <CheckboxGroup
                                list={carTypeList.map(i => i.carType)}
                                selected={filters.carType ? [filters.carType] : []}
                                setSelected={arr => {
                                    setFilters(prev => ({
                                        ...prev,
                                        carType: arr[0] || "",
                                    }));
                                }}
                                singleSelect={true}
                            />
                        ) : (
                            <div>등록된 차종이 없습니다.</div>
                        )}
                    </CustomContent>
                </AccordionItem>

                <AccordionItem value="carname">
                    <CustomTrigger>차량</CustomTrigger>
                    <CustomContent>
                        {carNameList.length > 0 ? (
                            <CheckboxGroup
                                list={carNameList.map(i => i.carName)}
                                selected={filters.carNames}
                                setSelected={arr => setFilters(prev => ({
                                    ...prev,
                                    carNames: arr,
                                }))}
                                vertical={true}
                            />
                        ) : (
                            <div>차종을 선택하세요.</div>
                        )}
                    </CustomContent>
                </AccordionItem>

                <AccordionItem value="carage">
                    <CustomTrigger>연식</CustomTrigger>
                    <CustomContent>
                        {carAgeList.length > 0 ? (
                            <YearDropdownRow>
                                <StyledDropdownBox
                                    options={[
                                        { label: "선택 안함", value: "" },
                                        ...carAgeList.map(y => ({
                                            label: `${y.carAge}년`,
                                            value: String(y.carAge)
                                        })),
                                    ]}
                                    value={startYear}
                                    onChange={handleStartYearChange}
                                />
                                <div style={{alignSelf: "center"}}>~</div>
                                <StyledDropdownBox
                                    options={[
                                        { label: "선택 안함", value: "" },
                                        ...carAgeList.map(y => ({
                                            label: `${y.carAge}년`,
                                            value: String(y.carAge)
                                        })),
                                    ]}
                                    value={endYear}
                                    onChange={handleEndYearChange}
                                />
                            </YearDropdownRow>
                        ) : (
                            <div>차종/차량을 선택하세요.</div>
                        )}
                    </CustomContent>
                </AccordionItem>

                <AccordionItem value="category">
                    <CustomTrigger>카테고리</CustomTrigger>
                    <CustomContent>
                        <CheckboxGroup
                            list={CATEGORY_OPTIONS}
                            selected={filters.articleTypes}
                            setSelected={arr => setFilters(prev => ({
                                ...prev,
                                articleTypes: arr
                            }))}
                            vertical={true}
                        />
                    </CustomContent>
                </AccordionItem>
            </AccordionRoot>
        </div>
    );
};

export default ArticleFilter;
