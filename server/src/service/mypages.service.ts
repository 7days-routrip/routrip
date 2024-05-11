import { AppDataSource } from "@/config/ormSetting";
import { Comments } from "@/models/comments.model";
import { Journeys } from "@/models/journeys.model";
import { Likes } from "@/models/likes.model";
import { Picks } from "@/models/picks.model";
import { Posts } from "@/models/posts.model";
import { Users } from "@/models/users.model";

const jnRepo = AppDataSource.getRepository(Journeys);
const postRepo = AppDataSource.getRepository(Posts);
const cmtRepo = AppDataSource.getRepository(Comments);
const likeRepo = AppDataSource.getRepository(Likes);
const pickRepo = AppDataSource.getRepository(Picks);
const userRepo = AppDataSource.getRepository(Users);

const getAllUserData = async (userId: number) => {
  const userData = await userRepo.findOne({ where: { id: userId } });
  const jnCount = await jnRepo.countBy({ user: { id: userId } });
  const postCount = await postRepo.countBy({ user: { id: userId } });
  const cmtCount = await cmtRepo.countBy({ user: { id: userId } });
  const likeCount = await likeRepo.countBy({ user: { id: userId } });
  const pickCount = await pickRepo.countBy({ user: { id: userId } });

  return {
    nickName: userData?.nickName,
    profileImg: userData?.profileImg,
    journeysNum: jnCount,
    postsNum: postCount,
    commentsNum: cmtCount,
    likePostsNum: likeCount,
    likeSpotsNum: pickCount,
  };
};
const MypagesService = { getAllUserData };
export default MypagesService;
