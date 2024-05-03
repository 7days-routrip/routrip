import { BorderRadius, ButtonScheme, ButtonSize } from "@/styles/theme";
import React from "react";
import styled from "styled-components";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  $size: ButtonSize;
  $scheme: ButtonScheme;
  $radius: BorderRadius;
}

export const Button = ({ children, $size, $scheme, $radius, ...props }: Props) => {
  return (
    <ButtonStyle $size={$size} $scheme={$scheme} $radius={$radius} {...props}>
      {children}
    </ButtonStyle>
  );
};

const ButtonStyle = styled.button<Omit<Props, "children">>`
  white-space: nowrap;
  font-size: ${({ theme, $size }) => theme.buttonSize[$size].fontSize};
  padding: ${({ theme, $size }) => theme.buttonSize[$size].padding};
  color: ${({ theme, $scheme }) => theme.buttonScheme[$scheme].color};
  background-color: ${({ theme, $scheme }) => theme.buttonScheme[$scheme].backgroundColor};
  border-radius: ${({ theme, $radius }) => theme.borderRadius[$radius]};
  border: ${({ theme, $scheme }) => theme.buttonScheme[$scheme].border};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  cursor: ${({ disabled }) => (disabled ? "none" : "pointer")};
`;

interface BBProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  $scheme: ButtonScheme;
  $radius: BorderRadius;
}

export const BigButton = ({ children, $scheme, $radius, ...props }: BBProps) => {
  return (
    <BigButtonStyle $scheme="primary" $radius="default">
      {children}
    </BigButtonStyle>
  );
};

const BigButtonStyle = styled.button<Omit<BBProps, "children">>`
  width: 26rem;
  white-space: nowrap;
  font-size: 1.125rem;
  padding: 0.75rem 3rem;
  color: ${({ theme, $scheme }) => theme.buttonScheme[$scheme].color};
  background-color: ${({ theme, $scheme }) => theme.buttonScheme[$scheme].backgroundColor};
  border: ${({ theme, $scheme }) => theme.buttonScheme[$scheme].border};
  border-radius: 8px;
`;
