import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ArrowDownIcon from "../assets/imgs/arrow_down.png"; // 화살표 아이콘
import { useMediaQuery } from "react-responsive";

const Container = styled.div`
  position: absolute;
  display: flex;
  width: 300px;
  height: ${(props) => (props.$open ? "190px" : "auto")};
  z-index: 100;
  /* top: 270px; */
  width: ${(props) => (props.$ismobile ? "100%" : "auto")};
`;

const Button = styled.button`
  height: 20px;
  border: none;
  font-size: 15px;
  color: #333;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  width: ${(props) => (props.$ismobile ? "100%" : "140px")};
`;

const Dropdown = styled.ul`
  top: 15px;
  right: 0;
  margin-top: 6px;
  padding: 6px 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  list-style: none;
  z-index: 10;
  position: absolute;
  display: ${(props) => (props.$open ? "block" : " none")};
  /* min-width: 140px; */
  width: ${(props) => (props.$ismobile ? "100%" : "130px")};
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

const SortDropdown = ({ options, value, onChange, isOpen }) => {
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

  const handleBtn = () => {
    isOpen((prev) => !prev);
  };
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <Container ref={ref} $ismobile={isMobile} $open={open}>
      <Button
        onClick={() => {
          setOpen((prev) => !prev);

          handleBtn();
        }}
      >
        {selectedLabel || "정렬"}
        <Arrow src={ArrowDownIcon} open={open} />
      </Button>
      <Dropdown $open={open}>
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
    </Container>
  );
};

export default SortDropdown;
