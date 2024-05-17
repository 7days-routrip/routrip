export interface Post {
  id: number;
  title: string;
  date: string;
  author: string;
  totalExpense: string;
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
  totalItems: number;
}

export interface PostList {
  posts: Post[];
  pagenation: Pagination;
}
