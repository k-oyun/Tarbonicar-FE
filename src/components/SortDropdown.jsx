import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ArrowDownIcon from "../assets/imgs/arrow_down.png"; // 화살표 아이콘
import { useMediaQuery } from "react-responsive";

const Container = styled.div`
  position: relative;
  display: inline-block;
  width: ${(props) => (props.$ismobile ? "100%" : "auto")};
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  width: ${(props) => (props.$ismobile ? "100%" : "140px")};
`;

const Dropdown = styled.ul`
  top: 100%;
  right: 0;
  margin-top: 6px;
  padding: 6px 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  list-style: none;
  z-index: 1000;
  min-width: 140px;
  width: ${(props) => (props.$ismobile ? "100%" : "140px")};
`;

const DropdownItem = styled.li`
  padding: 8px 16px;
  font-size: 14px;
  color: ${(props) => (props.selected ? "#0d6efd" : "#333")};
  background-color: ${(props) => (props.selected ? "#f0f8ff" : "#fff")};
  cursor: pointer;

  &:hover {
    background-color: #f4f4f4;
  }
`;

const Arrow = styled.img`
  width: 12px;
  height: 12px;
  transition: transform 0.2s;
  transform: ${(props) => (props.open ? "rotate(180deg)" : "rotate(0deg)")};
`;

const SortDropdown = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const isMobile = useMediaQuery({ query: "(max-width:767px)" });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <Container ref={ref} $ismobile={isMobile}>
      <Button onClick={() => setOpen((prev) => !prev)}>
        {selectedLabel || "정렬"}
        <Arrow src={ArrowDownIcon} open={open} />
      </Button>
      {open && (
        <Dropdown>
          {options.map((opt) => (
            <DropdownItem
              key={opt.value}
              selected={opt.value === value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </Container>
  );
};

export default SortDropdown;
