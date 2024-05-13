export interface iListMapData {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  postsImg: Blob;
  continent: string;
  country: string;
  nickName: string;
  profileImg: Blob;
  commentsNum: string;
  likesNum: string;
}

export interface iPostListData {
  title: string;
  date: string;
  author: string;
  profileImg: string;
  continent: string;
  county: string;
  likeNum: number;
  commentNum: number;
}
