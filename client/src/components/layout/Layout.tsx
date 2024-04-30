import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <WrapperStyle>
      <Header />
      <LayoutStyle>{children}</LayoutStyle>
      <Footer />
    </WrapperStyle>
  );
};
const WrapperStyle = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const LayoutStyle = styled.main`
  width: 100%;
  flex: 1;
  margin: 80px auto 0;

  @media ${({ theme }) => theme.mediaQuery.mobile} {
    padding: 1.8rem 1.5rem;
  }

  @media ${({ theme }) => theme.mediaQuery.desktop} {
    max-width: 1080px;
  }
`;

export default Layout;
