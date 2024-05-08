import React, { ForwardedRef } from "react";
import styled from "styled-components";
import { Button } from "./Button";
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  inputType?: "text" | "email" | "password" | "number" | "passwordConfirm";
  $inputsize?: "large" | "small";
  isButton?: boolean;
  buttonText?: string;
  onConfirm?: () => void;
  isDisabled?: boolean;
}
const InputText = React.forwardRef(
  (
    { placeholder, inputType, onChange, size, isButton = false, buttonText, onConfirm, isDisabled, ...props }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <InputWrapperStyle>
        <InputTextStyle placeholder={placeholder} type={inputType} ref={ref} onChange={onChange} {...props} />
        {isButton && (
          <Button
            $size="medium"
            $radius="default"
            type="button"
            $scheme="primary"
            onClick={onConfirm}
            disabled={isDisabled}
          >
            {buttonText}
          </Button>
        )}
      </InputWrapperStyle>
    );
  },
);

const InputWrapperStyle = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 1.5rem;
  > button {
    flex: 1;
    display: flex;

    width: 5rem;
    justify-content: center;
    align-items: center;
  }
`;

const InputTextStyle = styled.input<Pick<Props, "$inputsize">>`
  padding: 0.2rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  font-size: 1rem;
  line-height: 1.5;
  width: ${({ $inputsize }) => ($inputsize === "large" ? "26rem" : "100%")};
  height: 40px;
  /* color: ${({ theme }) => theme.color.text}; */
`;

export default InputText;
