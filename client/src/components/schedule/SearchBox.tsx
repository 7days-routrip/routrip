import Icons from "@/icons/icons";
import styled from "styled-components";

interface Props {
  placeholder: string;
  searchKeyword: string;
  requestHandler: (keyword: string) => void;
  setSearchKeyword: (keyword: string) => void;
}

const SearchBox = ({ placeholder, searchKeyword, requestHandler, setSearchKeyword }: Props) => {
  const handleSearch = () => {
    requestHandler(searchKeyword);
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
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
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

  input::placeholder {
    font-size: ${({ theme }) => theme.fontSize.xsmall};
  }

  .search-input {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid ${({ theme }) => theme.color.borderGray};
    border-radius: ${({ theme }) => theme.borderRadius.leftRadius};
    color: ${({ theme }) => theme.color.black};
    font-size: 1rem;

    &:focus {
      outline: none;
      border: 1px solid ${({ theme }) => theme.color.primary};
    }
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
