import styled from "styled-components";
import { FontSize } from "@/styles/theme";

interface Props {
  children: React.ReactNode;
  size: FontSize;
}

const Title = ({ children, size }: Props) => {
  return <TitleStyle size={size}>{children}</TitleStyle>;
};

const TitleStyle = styled.h1<Omit<Props, "children">>`
  font-size: ${({ theme, size }) => theme.fontSize[size]};
`;

export default Title;
