export interface BasicPost {
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
  liked?: boolean;
}

export interface Post extends BasicPost {}

export interface Pagination {
  page: number;
  totalItems: number;
}

export interface PostList {
  posts: Post[];
  pagination: Pagination;
}

interface Spot {
  placeId: string;
  name: string;
  tel: string;
  address: string;
  openingHours: string[];
}

interface Journey {
  id: number;
  spots: Array<{
    day: number;
    spot: Spot[];
  }>;
}

export interface DailyPost extends BasicPost {
  journeys: Journey[];
}

export interface DetailPost extends BasicPost {
  journeys?: Journey;
}
