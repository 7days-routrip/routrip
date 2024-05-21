import styled from "styled-components";
import icons from "@/icons/icons";
import PostCard, { AreaType } from "@/components/common/postCard";
import { Post } from "@/models/post.model";
import { useEffect, useRef, useState } from "react";
import { ViewMode } from "@/components/common/postCard";
import { useLocation, useNavigate } from "react-router-dom";
import { Country, regions } from "@/data/region";
import RegionCountrySelector from "@/components/common/RegionCountrySelector";
import WriteTopBtn from "@/components/common/WriteTopBtn";
import Loading from "@/components/common/Loading";
import { httpClient } from "@/apis/https";

interface PostPageStyleProps {
  view: ViewMode;
  area: AreaType;
  loading: boolean;
  $isExist: boolean;
}

const PostPage = () => {
  const { SearchIcon, GridIcon, ListIcon } = icons;
  const [view, setView] = useState<ViewMode>("grid");
  const [sortOrder, setSortOrder] = useState<string>("recent");
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(0);
  const [countries, setCountries] = useState<Country[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState<string>("");
  const loader = useRef<HTMLDivElement | null>(null);
  const itemsPerPage = 12;

  const location = useLocation();
  const nav = useNavigate();
  const params = new URLSearchParams(location.search);
  const areaParam = params.get("area");
  const countryId = params.get("filter") || "";
  const regionId = params.get("region") || "";
  const searchKeyword = params.get("keyword") || "";

  const area: AreaType = areaParam === "home" || areaParam === "abroad" ? areaParam : "home";

  useEffect(() => {
    if (regionId && countryId) {
      setSelectedRegion(parseInt(regionId));
      setSelectedCountry(parseInt(countryId));
      const region = regions.find((region) => region.id === parseInt(regionId));
      setCountries(region ? region.countries : []);
    }
  }, [regionId, countryId]);

  const clickListBtn = () => setView("list");
  const clickGridBtn = () => setView("grid");

  const fetchPosts = async (page: number, reset = false) => {
    setLoading(true);
    try {
      const response = await httpClient.get(
        `/posts?area=${area}&filter=${countryId}&keyword=${searchKeyword}&pages=${page}&limit=${itemsPerPage}`,
      );
      const data = response.data;

      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setHasMore(page * itemsPerPage < data.pagination.totalItems);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const resetAndFetchPosts = async () => {
      setPage(1);
      await fetchPosts(1, true);
    };

    resetAndFetchPosts();
  }, [area, countryId, searchKeyword]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          console.log("Loader is visible. Fetching next page...");
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader, hasMore, loading]);

  const handleRegionChange = (event: { target: { value: string } }) => {
    const regionId = parseInt(event.target.value);
    const region = regions.find((region) => region.id === regionId);
    setCountries(region ? region.countries : []);
    setSelectedRegion(regionId);
    setSelectedCountry(0);
    params.delete("filter");
    params.delete("region");
    params.delete("country");
    nav({ search: params.toString() });
  };

  const handleCountryChange = (event: { target: { value: string } }) => {
    const countryId = parseInt(event.target.value);
    setSelectedCountry(countryId);
    if (countryId === 0) {
      params.delete("filter");
      params.delete("country");
    } else {
      params.set("filter", countryId.toString());
      params.set("country", countryId.toString());
    }
    nav({ search: params.toString() });
  };

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleSearch = () => {
    params.set("keyword", keyword);
    nav({ search: params.toString() });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const sortPosts = (posts: Post[], order: string) => {
    return order === "recent"
      ? [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : [...posts].sort((a, b) => parseInt(b.likesNum, 10) - parseInt(a.likesNum, 10));
  };

  let $isExist;
  const sortedPosts = sortPosts(posts, sortOrder);
  sortedPosts.length !== 0 ? ($isExist = true) : ($isExist = false);

  return (
    <PostPageStyle view={view} area={area} loading={loading} $isExist={$isExist}>
      <WriteTopBtn isWriting={true} />
      <div className="main-content">
        <div className="control-wrapper">
          <div className="select-wrapper">
            {area === "abroad" ? (
              <RegionCountrySelector
                regions={regions}
                selectedRegion={selectedRegion}
                selectedCountry={selectedCountry}
                countries={countries}
                onRegionChange={handleRegionChange}
                onCountryChange={handleCountryChange}
                hideKorea={true}
              />
            ) : null}
            <div className="input-wrapper">
              <input
                type="search"
                placeholder="검색어를 입력하세요."
                value={keyword}
                onChange={handleKeywordChange}
                onKeyPress={handleKeyPress}
              />
              <SearchIcon onClick={handleSearch} />
            </div>
          </div>
          <div className="view-toggle">
            <select onChange={(e) => setSortOrder(e.target.value)}>
              <option value="recent">최신순</option>
              <option value="likes">인기순</option>
            </select>
            <GridIcon width="24px" height="24px" onClick={clickGridBtn} />
            <ListIcon width="24px" height="24px" onClick={clickListBtn} />
          </div>
        </div>
      </div>

      <div className="post">
        {loading && page === 1 ? (
          <div className="loading-wrapper">
            <Loading />
          </div>
        ) : sortedPosts.length !== 0 ? (
          <>
            {sortedPosts.map((post, index) => (
              <PostCard key={post.id || index} PostProps={post} view={view} />
            ))}
            {hasMore && !loading && <div ref={loader} />}
          </>
        ) : (
          <div className="no-data">게시글이 존재하지 않습니다.</div>
        )}
      </div>
    </PostPageStyle>
  );
};

const PostPageStyle = styled.div<PostPageStyleProps>`
  .main-content {
    justify-content: center;
    align-items: center;
    max-width: ${(props) => (props.view === "list" ? "790px" : "1080px")};
    border-bottom: 1px solid #e7e7e7;
    padding: 1rem 0px;
    margin: 0 auto;
  }

  .control-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: ${(props) => (props.view === "list" ? "790px" : "1080px")};
    gap: 20px;
  }

  .select-wrapper {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .continent-country {
    display: flex;
    gap: 10px;
    align-items: center;

    > select {
      border: 1px solid ${({ theme }) => theme.color.commentGray};
      border-radius: ${({ theme }) => theme.borderRadius.default};
    }
  }
  .continent,
  .country {
    width: 120px;
    padding: 8px 12px;
  }

  select {
    padding: 8px;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid ${({ theme }) => theme.color.commentGray};
    width: 360px;
    padding: 8px;
    border-radius: ${({ theme }) => theme.borderRadius.default};

    svg {
      color: ${({ theme }) => theme.color.commentGray};
      cursor: pointer;
    }
  }

  input {
    border: none;
    flex-grow: 1;
    padding: 0 8px;
    font-size: 16px;
    outline: none;

    &::placeholder {
      font-size: ${({ theme }) => theme.fontSize.xsmall};
    }
  }

  .view-toggle {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: flex-end;

    select {
      border: 1px solid ${({ theme }) => theme.color.commentGray};
      border-radius: ${({ theme }) => theme.borderRadius.default};
      padding: 8px;
    }
  }

  .post {
    display: ${(props) => (props.$isExist ? "grid" : "flex")};
    grid-template-columns: ${(props) =>
      props.view === "grid" ? "repeat(auto-fill, minmax(32%, auto))" : "repeat(auto-fill, minmax(100%, auto))"};
    max-width: ${(props) => (props.view === "grid" ? "unset" : "790px")};
    gap: 14px;
    margin: 0 auto;
    padding-top: 1rem;
    padding-bottom: 1rem;
    position: relative;

    .no-data {
      width: 100%;
      text-align: center;
    }
    .loading-wrapper {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      z-index: 9999;
    }
  }
  @media screen and (max-width: 1080px) {
    .control-wrapper {
      width: 90%;
      margin: 0 auto;
    }
  }

  @media (max-width: 768px) {
    .main-content {
      width: 100%;
    }

    .control-wrapper {
      flex-direction: column;
      width: 100%;
    }
    .select-wrapper {
      width: 100%;
      justify-content: center;
      flex-flow: ${(props) => (props.area === "abroad" ? "row wrap" : "row")};

      .continent-country {
        width: 90%;
      }
      .continent-country > * {
        width: 50%;
      }
    }

    .input-wrapper,
    .view-toggle {
      width: 90%;
    }
    .view-toggle {
      justify-content: flex-end;
    }

    .post {
      width: 100%;
      grid-template-columns: ${(props) =>
        props.view === "grid" ? "repeat(auto-fill, minmax(45%, auto))" : "repeat(auto-fill, minmax(100%, auto))"};
    }
  }
`;

export default PostPage;
