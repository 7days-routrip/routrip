export interface Profile {
  journeysNum: number;
  postsNum: number;
  commentsNum: number;
  likePostsNum: number;
  likeSpotsNum: number;
  profile: string;
}

export interface ProfileCard extends Profile {
  nickname: string;
}