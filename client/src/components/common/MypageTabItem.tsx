import styled from "styled-components";
interface Props {
  title: string;
  ative: boolean;
}

const MypageTabItem = ({ title, ative }: Props) => {
  return <MypageTabItemStyle $ative={ative}>{title}</MypageTabItemStyle>;
};

interface MypageTabItemStyleProps {
  $ative: boolean;
}

const MypageTabItemStyle = styled.button<MypageTabItemStyleProps>`
  width: 100%;
  line-height: 40px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  background-color: ${({ $ative, theme }) => ($ative ? theme.color.primary : theme.color.white)};
  color: ${({ $ative, theme }) => ($ative ? theme.color.white : theme.color.black)};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  font-size: ${({ theme }) => theme.fontSize.medium};
  text-align: center;
  padding: 0;

  @media (max-width: 768px) {
    /* width: 5px; */
    font-size: ${({ theme }) => theme.fontSize.xsmall};
    height: 40px;
  }
`;

export default MypageTabItem;
