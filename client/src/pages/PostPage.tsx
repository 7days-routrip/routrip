import styled from "styled-components";
import icons from "@/icons/icons";
import PostCard from "@/components/common/postCard";
import { Post } from "@/models/post.model";
import { useEffect, useRef, useState } from "react";
import { ViewMode } from "@/components/common/postCard";
import { Link } from "react-router-dom";

const regions = [
  { id: 1, name: "동아시아", countries: ["대한민국", "일본", "중국", "대만"] },
  { id: 2, name: "동남아시아", countries: ["필리핀", "베트남", "태국", "인도네시아", "싱가포르"] },
  {
    id: 3,
    name: "유럽",
    countries: [
      "영국",
      "프랑스",
      "이탈리아",
      "독일",
      "스위스",
      "벨기에",
      "스페인",
      "그리스",
      "스웨덴",
      "체코/슬로바키아",
      "폴란드",
      "터키",
    ],
  },
  { id: 4, name: "남아메리카", countries: ["브라질", "아르헨티나", "칠레", "페루", "콜롬비아"] },
  { id: 5, name: "북아메리카", countries: ["미국", "캐나다", "멕시코"] },
  { id: 6, name: "오세아니아", countries: ["호주", "뉴질랜드"] },
];

interface PostPageStyleProps {
  view: string;
}

const PostPage = () => {
  const { SearchIcon, GridIcon, ListIcon } = icons;
  const [view, setView] = useState<ViewMode>("grid");
  const [sortOrder, setSortOrder] = useState<string>("recent");
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [countries, setCountries] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const clickListBtn = () => setView("list");
  const clickGridBtn = () => setView("grid");

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`http://localhost:1234/api/posts?area=home&pages=${page}`);
      const data = await response.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.pagination.page * 2 < data.pagination.totalPosts);
    };

    fetchPosts();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
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
  }, [loader, hasMore]);

  const handleRegionChange = (event: { target: { value: string } }) => {
    const regionId = parseInt(event.target.value);
    const region = regions.find((region) => region.id === regionId);
    setCountries(region ? region.countries : []);
    setSelectedRegion(regionId);
  };

  const sortedPosts =
    sortOrder === "recent"
      ? [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : [...posts].sort((a, b) => parseInt(b.likesNum, 10) - parseInt(a.likesNum, 10));

  return (
    <PostPageStyle view={view}>
      <div className="main-content">
        <div className="control-wrapper">
          <div className="select-wrapper">
            <div className="continent-country">
              <select className="continent" onChange={handleRegionChange}>
                <option value="0">전체</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
              <select className="country">
                <option value="0">전체</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-wrapper">
              <input type="search" placeholder="검색어를 입력하세요." />
              <SearchIcon />
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
        {sortedPosts.map((post) => (
          <PostCard key={post.id} PostProps={post} view={view} />
        ))}
        <div ref={loader} />
      </div>
    </PostPageStyle>
  );
};

const PostPageStyle = styled.div<PostPageStyleProps>`
  .main-content {
    display: grid;
    justify-content: center;
    align-items: center;
    width: ${(props) => (props.view === "list" ? "790px" : "1080px")};
    border-bottom: 1px solid #e7e7e7;
    padding: 0px 0px 20px 0px;
    margin: 10px auto 20px auto;
  }

  .control-wrapper {
    display: grid;
    justify-content: center;
    align-items: center;
    width: 960px;
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
    border: 1px solid black;
    width: 360px;
    padding: 8px;
    border-radius: ${({ theme }) => theme.borderRadius.default};
  }

  input {
    border: none;
    flex-grow: 1;
    padding: 0 8px;
    font-size: 16px;
    outline: none;
  }

  .view-toggle {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: flex-end;
  }

  .post {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    justify-content: center;
    width: 1080px;
  }

  @media (max-width: 768px) {
    .main-content {
      width: 100%;
    }

    .control-wrapper {
      flex-direction: column;
      width: 100%;
    }

    .select-wrapper,
    .input-wrapper,
    .view-toggle {
      width: 100%;
    }
    .view-toggle {
      justify-content: flex-end;
    }

    .post {
      width: 100%;
    }
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export default PostPage;
