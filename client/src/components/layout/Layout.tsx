import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  isFull?: boolean;
}

const Layout = ({ children, isFull = false }: LayoutProps) => {
  return (
    <WrapperStyle $isFull={isFull}>
      <Header isFull={isFull} />
      <LayoutStyle>{children}</LayoutStyle>
      <Footer />
    </WrapperStyle>
  );
};

interface WrapperStyleProps {
  $isFull: boolean;
}

const WrapperStyle = styled.div<WrapperStyleProps>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  width: 100%;
  max-width: ${({ $isFull }) => ($isFull ? "100%" : "1080px")};
`;

const LayoutStyle = styled.main`
  flex: 1;
  margin-top: 80px;

  @media ${({ theme }) => theme.mediaQuery.mobile} {
    padding: 1.8rem 0.5rem;
  }
`;

export default Layout;
