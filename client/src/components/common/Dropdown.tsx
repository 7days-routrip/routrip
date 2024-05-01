import useOnClickOutside from "@/hooks/useOnClickOutside";
import React, { useRef, useState } from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  toggleIcon: React.ReactNode;
}

const Dropdown = ({ children, toggleIcon }: Props) => {
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
      width: 2.4rem;
      height: 2.4rem;
      fill: ${({ theme }) => theme.color.primary};
      color: ${({ theme }) => theme.color.primary};
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
