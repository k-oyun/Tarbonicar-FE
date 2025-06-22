import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FiChevronDown } from "react-icons/fi";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  list-style: none;
  padding: 0;
  z-index: 1000;
  width: 180px;
`;

const DropdownItem = styled.li`
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SortDropdown = ({ selected = "최근 작성 순", onSelect = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const CATEGORIES = ["최근 작성 순", "마지막 작성 순", "좋아요 순"];

  // 외부 클릭 시 닫힘
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContainer ref={ref}>
      <DropdownButton onClick={() => setIsOpen((prev) => !prev)}>
        {selected}
        <FiChevronDown />
      </DropdownButton>
      {isOpen && (
        <DropdownList>
          {CATEGORIES.map((item) => (
            <DropdownItem
              key={item}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
              }}
            >
              {item}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default SortDropdown;
