export interface Comment {
  postId: number;
  content: string;
  postTitle: string;
  createdAt: string;
}

export interface PostComment {
  id: number;
  content: string;
  postTitle: string;
  createdAt: string;
  nickName: string;
  profileImg: string;
}
