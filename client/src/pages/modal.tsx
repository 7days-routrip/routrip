import { useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const StyledButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

export const Modal = () => {
  const [inputValue, setInputValue] = useState("");

  const swalButton = Swal.mixin({
    customClass: {
      popup: "popup", // 전체
      confirmButton: "confirmButton", // 취소
      cancelButton: "cancelButton", // 삭제
      title: "title", // 타이틀
      htmlContainer: "htmlContainer", // 내용
    },
    buttonsStyling: false,
  });

  const showSwal = () => {
    withReactContent(swalButton).fire();
  };

  return (
    <>
      <StyledButton onClick={showSwal}>Show SweetAlert2 modal</StyledButton>
      <div>Your input: {inputValue}</div>
    </>
  );
};
