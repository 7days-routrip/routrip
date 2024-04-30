// import { useEffect, useState } from "react";

// const MOBILE_MEDIA_QUERY = theme.mediaQuery.mobile;

// export const useMediaQuery = () => {
//   const [isMobile, setIsMobile] = useState(window.matchMedia(MOBILE_MEDIA_QUERY).matches);

//   useEffect(() => {
//     const mediaQueryList = window.matchMedia(MOBILE_MEDIA_QUERY);

//     const handleChange = (event: MediaQueryListEvent) => {
//       setIsMobile(event.matches);
//     };

//     mediaQueryList.addEventListener("change", handleChange);

//     return () => {
//       mediaQueryList.removeEventListener("change", handleChange);
//     };
//   }, []);

//   return { isMobile };
// };
