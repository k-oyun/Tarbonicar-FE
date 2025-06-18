import React from "react";
import styled from "styled-components";
import checkIcon from "../../assets/imgs/check.png";
import uncheckIcon from "../../assets/imgs/uncheck.png";

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
            setSelected(prev => prev.includes(value) ? [] : [value]);
        } else {
            setSelected(prev =>
                prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
            );
        }
    };

    return (
        <Wrapper vertical={vertical}>
            {list.map((item, i) => (
                <StyledLabel key={i} checked={selected.includes(item)}>
                    <HiddenCheckbox
                        checked={selected.includes(item)}
                        onChange={() => toggle(item)}
                    />
                    {item}
                </StyledLabel>
            ))}
        </Wrapper>
    );
};

export default CheckboxGroup;
