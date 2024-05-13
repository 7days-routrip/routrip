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

    /* 스크롤바 Track(트랙) */
    ::-webkit-scrollbar {
      width: 9px; /* 스크롤바의 너비 */
      height: 9px; /* 스크롤바의 높이 */
    }

    /* 스크롤바 Thumb(바) */
    ::-webkit-scrollbar-thumb {
      background-color: rgba(122, 175, 255, 0.4);
      border-radius: 8px; /* 바의 모서리 반경 */
      background-clip: padding-box;
      border: 2px solid transparent;
    }

      /* 스크롤바 Track(트랙) */
    ::-webkit-scrollbar-track {
      background-color: rgba(122, 175, 255, 0.1);
    }

  }

  a{
    text-decoration-line: none;
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
