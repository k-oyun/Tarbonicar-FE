import React, {forwardRef, useEffect, useState} from "react";
import axios from "axios";
import * as Accordion from "@radix-ui/react-accordion";
import {ChevronDownIcon} from "@radix-ui/react-icons";
import styled, {keyframes} from "styled-components";
import refresh from "../../assets/Svgs/refresh.svg";
import CheckboxGroup from "./CheckboxGroup.jsx";

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
        height: 0;
    }
    to {
        height: var(--radix-accordion-content-height);
    }
`;

const slideUp = keyframes`
    from {
        height: var(--radix-accordion-content-height);
    }
    to {
        height: 0;
    }
`;

const AccordionContent = styled(Accordion.Content)`
    overflow: hidden;
    font-size: 15px;
    color: #444444;
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

const BoardFilter = () => {
    const [openItems, setOpenItems] = useState(["cartype", "category"]);

    const [carTypeList, setCarTypeList] = useState([]);
    const [carNameList, setCarNameList] = useState([]);
    const [carAgeList, setCarAgeList] = useState([]);

    const [selectedCarTypes, setSelectedCarTypes] = useState([]);
    const [selectedCarNames, setSelectedCarNames] = useState([]);
    const [selectedCarAges, setSelectedCarAges] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/v1/category/search/cartype")
            .then(res => setCarTypeList(res.data.data || []))
            .catch(console.error);
    }, []);

    // 차종 선택 시 → 차량/연식 초기화
    useEffect(() => {
        if (selectedCarTypes.length === 1) {
            axios
                .get(`http://localhost:8080/api/v1/category/search/carname?carType=${selectedCarTypes[0]}`)
                .then((res) => setCarNameList(res.data.data || []))
                .catch(console.error);

            // ✅ 차량, 연식 초기화
            setSelectedCarNames([]);
            setSelectedCarAges([]);

            // 차량 아코디언 열기
            setOpenItems(prev => [...new Set([...prev, "carname"])]);
        } else {
            setCarNameList([]);
            setCarAgeList([]);
            setSelectedCarNames([]);
            setSelectedCarAges([]);
        }
    }, [selectedCarTypes]);

// 차량 선택 시 → 연식 초기화
    useEffect(() => {
        if (selectedCarNames.length === 1) {
            axios
                .get(`http://localhost:8080/api/v1/category/search/carage?carName=${selectedCarNames[0]}`)
                .then((res) => setCarAgeList(res.data.data || []))
                .catch(console.error);

            // ✅ 연식 초기화
            setSelectedCarAges([]);

            // 연식 아코디언 열기
            setOpenItems(prev => [...new Set([...prev, "carage"])]);
        } else {
            setCarAgeList([]);
            setSelectedCarAges([]);
        }
    }, [selectedCarNames]);

    const handleReset = () => {
        setSelectedCarTypes([]);
        setSelectedCarNames([]);
        setSelectedCarAges([]);
        setSelectedCategories([]);
    };

    const CATEGORIES = ["시승 후기", "차량 리뷰", "차량 팁"];

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
                                selected={selectedCarTypes}
                                setSelected={setSelectedCarTypes}
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
                                selected={selectedCarNames}
                                setSelected={setSelectedCarNames}
                                singleSelect={true}
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
                            <CheckboxGroup
                                list={carAgeList.map(i => `${i.carAge}년`)}
                                selected={selectedCarAges}
                                setSelected={setSelectedCarAges}
                                singleSelect={true}
                            />
                        ) : (
                            <div>차량을 선택하세요.</div>
                        )}
                    </CustomContent>
                </AccordionItem>

                <AccordionItem value="category">
                    <CustomTrigger>카테고리</CustomTrigger>
                    <CustomContent>
                        <CheckboxGroup
                            list={CATEGORIES}
                            selected={selectedCategories}
                            setSelected={setSelectedCategories}
                            vertical={true}
                        />
                    </CustomContent>
                </AccordionItem>
            </AccordionRoot>
        </div>
    );
};

export default BoardFilter;
