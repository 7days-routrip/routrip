import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  isFull?: boolean;
}

const Layout = ({ children, isFull = false }: LayoutProps) => {
  return (
    <WrapperStyle>
      <Header />
      <LayoutStyle $isFull={isFull}>{children}</LayoutStyle>
      <Footer />
    </WrapperStyle>
  );
};
const WrapperStyle = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

interface LayoutStyleProps {
  $isFull: boolean;
}
const LayoutStyle = styled.main<LayoutStyleProps>`
  width: 100%;
  max-width: ${({ $isFull }) => ($isFull ? "100%" : "1080px")};
  flex: 1;
  margin: 80px auto 0;

  @media ${({ theme }) => theme.mediaQuery.mobile} {
    padding: 1.8rem 0.5rem;
  }
`;

export default Layout;
