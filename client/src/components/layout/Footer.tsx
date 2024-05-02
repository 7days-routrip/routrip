import styled from "styled-components";
import FooterLogo from "../../../public/assets/images/logo-footer.png";

const Footer = () => {
  return (
    <FooterStyle>
      <img src={FooterLogo} alt="footer logo" width={"72px"} height={"55px"} />
      <div className="container">
        <div>2024, 7days</div>
        <div>copyrightⓒ</div>
      </div>
    </FooterStyle>
  );
};

const FooterStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  border-top: 1px solid #e7e7e7;
  gap: 16px;
  height: 150px;
  max-width: 1080px;
  width: 100%;
`;

export default Footer;
