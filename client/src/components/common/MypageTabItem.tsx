import styled from "styled-components";
interface Props {
  title: string;
  ative: boolean;
}

const MypageTabItem = ({ title, ative }: Props) => {
  return (
    <MypageTabItemStyle onClick={() => console.log("구현해야함")} $ative={ative}>
      {title}
    </MypageTabItemStyle>
  );
};

interface MypageTabItemStyleProps {
  $ative: boolean;
}

const MypageTabItemStyle = styled.button<MypageTabItemStyleProps>`
  width: 15%;
  height: 50px;
  line-height: 50px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  background-color: ${({ $ative, theme }) => ($ative ? theme.color.primary : theme.color.white)};
  color: ${({ $ative, theme }) => ($ative ? theme.color.white : theme.color.black)};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  font-size: ${({ theme }) => theme.fontSize.medium};
  text-align: center;

  @media (max-width: 768px) {
    width: auto;
    padding: 0 5px;
    height: 40px;
    line-height: 40px;
  }
`;

export default MypageTabItem;
