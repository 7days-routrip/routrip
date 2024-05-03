import styled from "styled-components";
import { useState } from "react";
import Icons from "@/icons/icons";

interface Props {
  placeholder: string;
  onSearch: (keyword: string) => void;
}

const SearchBox = ({ placeholder, onSearch }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm); //상위 컴포넌트의 상태 함수에 검색어 저장
    console.log(`검색 요청: ${searchTerm}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <SearchBoxStyle>
      <input
        className="search-input"
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="search-btn" onClick={handleSearch}>
        <Icons.SearchIcon />
      </button>
    </SearchBoxStyle>
  );
};

const SearchBoxStyle = styled.div`
  display: flex;
  align-items: center;

  .search-input {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid ${({ theme }) => theme.color.borderGray};
    border-radius: ${({ theme }) => theme.borderRadius.leftRadius};
    color: ${({ theme }) => theme.color.black};
    font-size: 1rem;
  }

  .search-btn {
    color: ${({ theme }) => theme.color.white};
    background-color: ${({ theme }) => theme.color.primary};
    border-radius: ${({ theme }) => theme.borderRadius.rightRadius};
    border: 1px solid ${({ theme }) => theme.color.primary};
    padding: 6px;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
`;

export default SearchBox;
