import useOnClickOutside from "@/hooks/useOnClickOutside";
import React, { useRef, useState } from "react";
import styled from "styled-components";

interface Props {
  title?: string;
  children: React.ReactNode;
  toggleIcon: React.ReactNode;
}

const Dropdown = ({ children, toggleIcon, title }: Props) => {
  const [open, setOpen] = useState(false);
  const dropdouwnRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdouwnRef, () => {
    setOpen(false);
  });

  return (
    <DropdownStyle ref={dropdouwnRef}>
      <div>
        <button className="toggle" onClick={() => setOpen((prev) => !prev)}>
          {toggleIcon}
          <span>{title}</span>
        </button>
      </div>
      {open && (
        <div className="panel">
          <div className="rhombus"></div>
          {children}
        </div>
      )}
    </DropdownStyle>
  );
};

const DropdownStyle = styled.div`
  position: relative;

  .toggle {
    margin-left: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    padding: 0;
    border: none;
    cursor: pointer;
    outline: none;

    svg,
    path,
    circle {
      /* width: 2.4rem; */
      width: 1.2rem;
      height: 2.4rem;
      fill: ${({ theme }) => theme.color.primary};
      color: ${({ theme }) => theme.color.primary};
    }
    gap: 0.3rem;
    span {
      display: inline-block;
      width: 80px;
      font-weight: bold;
      font-size: 1rem;
    }
  }

  .panel {
    position: absolute;
    top: 3rem;
    background-color: ${({ theme }) => theme.color.white};
    box-shadow: ${({ theme }) => theme.boxShadow.default};
    border-radius: ${({ theme }) => theme.borderRadius.default};
    border: 1px solid ${({ theme }) => theme.color.primary};
    z-index: 100;

    // 추가
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    white-space: nowrap;
    right: 1rem;
    padding: 0 0.5rem 0.5rem;
  }

  .rhombus::before {
    display: inline-block;
    position: absolute;
    content: "";

    width: 1rem;
    height: 1rem;
    top: -0.55rem;
    left: 1.6rem;
    transform: rotate(45deg);
    background-color: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.primary};
    border-right: none;
    border-bottom: none;
    white-space: nowrap;
  }
`;

export default Dropdown;
