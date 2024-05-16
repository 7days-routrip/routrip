import { AppDataSource } from "@/config/ormSetting";
import { Comments } from "@/models/comments.model";
import { Likes } from "@/models/likes.model";
import { Picks } from "@/models/picks.model";
import { setDateFromat } from "@/utils/posts.utils";

const reqPicksList = async (userId: number) => {
  const pickRepo = AppDataSource.getRepository(Picks);
  const picksResult = await pickRepo.find({
    where: { user: { id: userId } },
  });
  if (!picksResult || picksResult.length === 0) return { success: false, msg: "does not exist Like Place" };
  const returnData = picksResult?.map((place) => {
    const [lat, lng] = place.place.location;
    const open = [];
    const openSplit = place.place.openingHours.split(",");
    for (let i = 0; i < openSplit.length; i++) {
      open.push(openSplit[i].trim());
    }

    return {
      id: place.place.id,
      placeName: place.place.name,
      address: place.place.address,
      tel: place.place.tel,
      location: {
        lat: lat,
        lng: lng,
      },
      openingHours: open,
      siteUrl: place.place.siteUrl ? place.place.siteUrl : "",
      placeImg: place.place.img ? place.place.img : "",
    };
  });
  return { success: true, data: returnData };
};

const reqPicksInsertData = async (userId: number, placeId: string) => {
  const pickRepo = AppDataSource.getRepository(Picks);
  const pick = {
    user: { id: userId },
    place: { id: placeId },
  };

  const insertResult = await pickRepo.save(pick);
  if (!insertResult) return { success: false };
  return { success: true };
};

const reqPicksDeleteData = async (userId: number, placeId: string) => {
  const pickRepo = AppDataSource.getRepository(Picks);
  const deleteResult = await pickRepo.delete({ user: { id: userId }, place: { id: placeId } });
  if (!deleteResult.affected || deleteResult.affected < 1) return { success: false, msg: "failed" };
  return { success: true };
};

const reqLikesList = async (userId: number) => {
  const likeRepo = AppDataSource.getRepository(Likes);
  const likesResult = await likeRepo.find({ where: { user: { id: userId } } });
  const returnData = await Promise.all(
    likesResult.map(async (like) => {
      const likeNum = await getTotalLike(like.post.id);
      const commnetNum = await getTotalComment(like.post.id);
      return {
        id: like.post.id,
        title: like.post.title,
        date: (await setDateFromat(like.post.startDate)) + "-" + (await setDateFromat(like.post.endDate)),
        createAt: like.post.createdAt === like.post.updatedAt ? like.post.createdAt : like.post.updatedAt,
        author: like.user.nickName,
        profileImg: like.user.profileImg,
        continent: {
          id: like.post.continent.id,
          name: like.post.continent.name,
        },
        country: {
          id: like.post.country.id,
          name: like.post.country.name,
        },
        likesNum: likeNum,
        commentsNum: commnetNum,
      };
    }),
  );

  if (likesResult.length === 0) return { success: false, msg: "find not list" };
  return { success: true, data: returnData };
};

const reqLikesInsertData = async (userId: number, postId: number) => {
  const likeRepo = AppDataSource.getRepository(Likes);
  const like = {
    user: { id: userId },
    post: { id: postId },
  };

  const insertResult = await likeRepo.save(like);
  if (!insertResult) return { success: false };
  return { success: true };
};
const reqLikesDeleteData = async (userId: number, postId: number) => {
  const likeRepo = AppDataSource.getRepository(Likes);
  const insertResult = await likeRepo.delete({
    user: { id: userId },
    post: { id: postId },
  });
  if (!insertResult) return { success: false };
  return { success: true };
};

const existDataCheck = async (type: string, userId: number, itemId: number | string) => {
  if (type === "likes") {
    const repo = AppDataSource.getRepository(Likes);
    const data = await repo.findOne({
      where: {
        user: { id: userId },
        post: { id: itemId as number },
      },
    });
    return data ? { success: true } : { success: false };
  } else if (type === "picks") {
    const repo = AppDataSource.getRepository(Picks);
    const data = await repo.findOne({ where: { user: { id: userId }, place: { id: itemId as string } } });
    return data ? { success: true } : { success: false };
  }
};

const getTotalLike = async (postId: number) => {
  const likeRepo = AppDataSource.getRepository(Likes);
  const result = await likeRepo.count({ where: { post: { id: postId } } });
  return result;
};

const getTotalComment = async (postId: number) => {
  const commentRepo = AppDataSource.getRepository(Comments);
  return await commentRepo.count({ where: { post: { id: postId } } });
};

const LikesService = {
  reqPicksList,
  reqPicksInsertData,
  reqPicksDeleteData,
  reqLikesList,
  existDataCheck,
  reqLikesInsertData,
  reqLikesDeleteData,
};
export default LikesService;
