import { createGlobalStyle } from "styled-components";
import "sanitize.css"; // global css로 sanitize.css를 적용

// 프로젝트에 적용할 global style
export const GlobalStyle = createGlobalStyle`
  * {
    font-family: "Noto Sans", "Roboto", sans-serif;
  }

  html {
    font-size: 16px; /* desktop */
  }

  body {
    padding: 0;
    margin: 0;
    color: #333333;
  }

  svg, path {
    color: inherit;
  }

  li {
    list-style: none;
  }

  @media (min-width: 0) and (max-width: 768px){
    html {
      font-size: 12px;
    }
  }

  @media (min-width: 769px) and (max-width: 1080px){
    html {
      font-size: 14px;
    }
  }
`;
