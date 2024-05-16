export interface Post {
  id: number;
  title: string;
  date: string;
  author: string;
  profileImg: string;
  continent: {
    id: string;
    name: string;
  };
  country: {
    id: string;
    name: string;
  };
  commentsNum: string;
  likesNum: string;
  postsImg: string;
  createdAt: string;
  conetents: string;
}

export interface Pagination {
  page: number;
  totalPosts: number;
}

export interface PostList {
  posts: Post[];
  pagenation: Pagination;
}
