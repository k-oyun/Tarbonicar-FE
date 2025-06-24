import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const SelectBoxContainer = styled.div`
  display: flex;
  margin-top: 10px;
  position: relative;
  font-size: 13px;
`;
const SelectBoxButton = styled.button`
  width: 110px;
  height: 45px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: transparent;
  border: ${(props) =>
    props.$isSelected === "" ? "1px solid #d9d9d9" : "1px solid #002c5f"};
  border-radius: 10px;
  color: ${(props) => (props.$isSelected === "" ? "#d9d9d9" : "#002c5f")};
  text-align: start;
  cursor: pointer;
  padding-left: 20px;
  font-size: 13px;
`;

const SelectBoxList = styled.div`
  width: ${(props) => props.$width};
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-color: white;
  position: absolute;
  top: 37px;
  border-bottom: ${(props) =>
    !props.$isSelected ? "1px solid #d9d9d9" : "1px solid #002c5f"};
  border-left: ${(props) =>
    !props.$isSelected ? "1px solid #d9d9d9" : "1px solid #002c5f"};
  border-right: ${(props) =>
    !props.$isSelected ? "1px solid #d9d9d9" : "1px solid #002c5f"};
  box-sizing: border-box;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const SelectBoxItem = styled.li`
  cursor: pointer;
  width: 100%;
  padding-left: 14px;
  padding-top: 7px;
  padding-bottom: 7px;
  color: #d9d9d9;
  list-style: none;
  &:hover {
    color: #002c5f;
  }
`;

const SelectBox = ({
  options,
  placeholder,
  value,
  onSelect,
  isSelected,
  onClick,
  width,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectBoxRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectBoxRef.current &&
        !selectBoxRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <SelectBoxContainer ref={selectBoxRef}>
      <SelectBoxButton
        onClick={(e) => {
          setIsOpen((prev) => !prev);
          onClick?.(e);
        }}
        $isSelected={isSelected}
      >
        {selectedLabel || placeholder}
      </SelectBoxButton>
      {isOpen ? (
        <SelectBoxList $isOpen={isOpen} $isSelected={isSelected} $width={width}>
          {options.map((opt) => (
            <SelectBoxItem
              key={opt.value}
              onClick={() => {
                onSelect(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </SelectBoxItem>
          ))}
        </SelectBoxList>
      ) : null}
    </SelectBoxContainer>
  );
};

export default SelectBox;
