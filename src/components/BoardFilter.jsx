import React, {forwardRef} from "react";
import * as Accordion from "@radix-ui/react-accordion";
import {ChevronDownIcon} from "@radix-ui/react-icons";
import styled, {keyframes} from "styled-components";
import refresh from "../assets/Svgs/refresh.svg";

/* -------- styled-components -------- */
const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 8px;
`;

const FilterTitle = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const ResetButton = styled.button`
    all: unset;
    display: flex;
    align-items: center;
    gap: 6px; /* 이미지와 텍스트 간 간격 */
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
    width: 300px;
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
        //max-height: 300px;
        animation: ${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1);
    }

    &[data-state="closed"] {
        //max-height: 0;
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

/* -------- Custom Trigger / Content -------- */

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

/* -------- Main Component -------- */

const BoardFilter = () => (
    <div>
        <FilterContainer>
            <FilterTitle>필터</FilterTitle>
            <ResetButton onClick={() => alert("초기화!")}>
                <RefreshIcon src={refresh} alt="초기화 아이콘" />
                초기화
            </ResetButton>
        </FilterContainer>
        <AccordionRoot type="single" defaultValue="item-1" collapsible>
            <AccordionItem value="item-1">
                <CustomTrigger>차종</CustomTrigger>
                <CustomContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                </CustomContent>
            </AccordionItem>

            <AccordionItem value="item-2">
                <CustomTrigger>차량</CustomTrigger>
                <CustomContent>
                    Yes. It's unstyled by default, giving you freedom over the look and
                    feel.
                </CustomContent>
            </AccordionItem>

            <AccordionItem value="item-3">
                <CustomTrigger>연식</CustomTrigger>
                <CustomContent>
                    Yes! You can animate the Accordion with CSS or JavaScript.
                </CustomContent>
            </AccordionItem>

            <AccordionItem value="item-4">
                <CustomTrigger>카테고리</CustomTrigger>
                <CustomContent>
                    Yes! You can animate the Accordion with CSS or JavaScript.
                </CustomContent>
            </AccordionItem>
        </AccordionRoot>
    </div>
);

export default BoardFilter;
