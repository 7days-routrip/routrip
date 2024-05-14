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
        <div>2024, 7days Team copyrightⓒ</div>
        <small className="icon-license-link">
          <a href="https://www.flaticon.com/free-icons/location-marker" title="location marker icons">
            Location marker icons created by redempticon - Flaticon
          </a>
        </small>
      </div>
    </FooterStyle>
  );
};

const FooterStyle = styled.div<HeaderStyleProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  border-top: 1px solid ${({ theme }) => theme.color.borderGray};
  padding: 0.5rem 0;
  gap: 16px;
  height: 80px;
  width: 100%;
  flex-shrink: 0;
  max-width: ${({ $isFull }) => ($isFull ? "100%" : "1080px")};

  @media ${({ theme }) => theme.mediaQuery.mobile} {
    img {
      width: 50px;
      height: 37px;
    }
  }

  .icon-license-link {
    a {
      font-size: 0.5rem;
      color: ${({ theme }) => theme.color.borderGray};
      text-decoration: none;
    }
  }
`;

export default Footer;
