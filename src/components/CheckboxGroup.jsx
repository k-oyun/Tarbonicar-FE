import React from "react";
import styled from "styled-components";
import checkIcon from "../assets/imgs/check.png";
import uncheckIcon from "../assets/imgs/uncheck.png";

const Wrapper = styled.div`
    display: flex;
    flex-direction: ${({ vertical }) => (vertical ? "column" : "row")};
    flex-wrap: ${({ vertical }) => (vertical ? "nowrap" : "wrap")};
    gap: 8px;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
    display: none;
`;

const StyledLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    cursor: pointer;

    &::before {
        content: "";
        width: 25px;
        height: 25px;
        background-image: ${({ checked }) => `url(${checked ? checkIcon : uncheckIcon})`};
        background-size: cover;
        background-position: center;
        display: inline-block;
    }
`;

const CheckboxGroup = ({ list, selected, setSelected, singleSelect = false, vertical = false }) => {
    const toggle = (value) => {
        if (singleSelect) {
            setSelected(selected[0] === value ? [] : [value]);
        } else {
            setSelected(
                selected.includes(value)
                    ? selected.filter(v => v !== value)
                    : [...selected, value]
            );
        }
    };

    return (
        <Wrapper vertical={vertical}>
            {list.map((item) => {
                // 객체형(list={CATEGORY_OPTIONS}) 지원
                const value = typeof item === "string" ? item : item.value;
                const label = typeof item === "string" ? item : item.label;
                return (
                    <StyledLabel key={value} checked={selected.includes(value)}>
                        <HiddenCheckbox
                            checked={selected.includes(value)}
                            onChange={() => toggle(value)}
                        />
                        {label}
                    </StyledLabel>
                );
            })}
        </Wrapper>
    );
};

export default CheckboxGroup;
