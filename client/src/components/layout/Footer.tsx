import styled from "styled-components";
import FooterLogo from "../../../public/assets/images/logo-footer.png";
import { HeaderStyleProps } from "./Header";

interface Props {
  isFull?: boolean;
}

const Footer = ({ isFull = false }: Props) => {
  return (
    <FooterStyle $isFull={isFull}>
      <img src={FooterLogo} alt="footer logo" width={"72px"} height={"55px"} />
      <div className="container">
        <div>2024, 7days</div>
        <div>copyrightⓒ</div>
      </div>
    </FooterStyle>
  );
};

const FooterStyle = styled.div<HeaderStyleProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  border-top: 1px solid #e7e7e7;
  gap: 16px;
  height: 80px;
  width: 100%;
  max-width: ${({ $isFull }) => ($isFull ? "100%" : "1080px")};
`;

export default Footer;
