import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import ArrowDownIcon from "../assets/imgs/arrow_down.png"

const SelectContainer = styled.div`
    position: relative;
    min-width: 0;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
`;

const SelectedValue = styled.div`
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 7px;
    background: #fff;
    cursor: pointer;
    font-size: 15px;
    color: #777;
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: space-between;
`;

const Dropdown = styled.div`
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 7px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    max-height: 200px;
    overflow-y: auto;
    z-index: 99999;
`;

const DropdownItem = styled.div`
    padding: 8px 12px;
    cursor: pointer;
    color: ${props => props.selected ? "#0984e3" : "#888"};
    font-weight: ${props => props.selected ? "bold" : "normal"};
    background: ${props => props.selected ? "#f5fafd" : "#fff"};
    &:hover { background: #eaf3fa; }
`;

const ArrowIcon = styled.span`
    margin-left: 4px;
    font-size: 14px;
    transform: ${props => props.open ? "rotate(180deg)" : "none"};
    transition: 0.15s;
`;

const DropdownPortal = ({ open, anchorRef, children }) => {
    const [style, setStyle] = useState({});

    const updatePosition = () => {
        if (open && anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setStyle({
                position: "absolute",
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                zIndex: 9999999,
            });
        }
    };

    useEffect(() => {
        if (open) {
            updatePosition();
            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition, true);
        }
        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition, true);
        };
    }, [open, anchorRef]);

    // anchorRef의 변화도 watch해서 항상 위치 갱신!
    useEffect(() => {
        updatePosition();
    }, [anchorRef, open]);

    if (!open) return null;
    return ReactDOM.createPortal(
        <div style={style}>{children}</div>,
        document.body
    );
};

export const DropdownBox = ({ options, value, onChange, placeholder = "선택" }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handleClick = e => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("click", handleClick); // mousedown → click
        return () => document.removeEventListener("click", handleClick);
    }, []);

    return (
        <SelectContainer ref={ref}>
            <SelectedValue onClick={() => setOpen(v => !v)}>
                {options.find(opt => opt.value === value)?.label || placeholder}
                <ArrowIcon src={ArrowDownIcon} alt="arrow" open={open} />
            </SelectedValue>
            <DropdownPortal open={open} anchorRef={ref}>
                <Dropdown>
                    {options.map(opt => (
                        <DropdownItem
                            key={opt.value}
                            selected={value === opt.value}
                            onClick={() => {
                                console.log('옵션 선택됨', opt.value);
                                onChange(opt.value);
                                setOpen(false);
                            }}
                        >
                            {opt.label}
                        </DropdownItem>
                    ))}
                </Dropdown>
            </DropdownPortal>
        </SelectContainer>
    );
};
