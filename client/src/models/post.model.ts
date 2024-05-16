// 임의로 해논거 이거 나중에 변경 해야해함
export interface Post {
  id: number;
  title: string;
  date: string;
  author: string;
  profileImg: string;
  continent: {
    id: number;
    name: string;
  };
  country: {
    id: number;
    name: string;
  };
  commentsNum: string;
  likesNum: string;
  postsImg: string;
  createdAt: string;
  contents: string;
}

export interface Pagination {
  page: number;
  totalPosts: number;
}

export interface PostList {
  posts: Post[];
  pagenation: Pagination;
}
