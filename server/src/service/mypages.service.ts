import { AppDataSource } from "@/config/ormSetting";
import { Comments } from "@/models/comments.model";
import { Journeys } from "@/models/journeys.model";
import { Likes } from "@/models/likes.model";
import { Picks } from "@/models/picks.model";
import { Posts } from "@/models/posts.model";
import { Users } from "@/models/users.model";
import { LIMIT } from "@/settings";
import { getOffset, setDateFromat } from "@/utils/posts.utils";
import PostsService from "./posts.service";

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
const getJourneysList = async (userId: number, pages: number) => {
  const offset = await getOffset(pages, LIMIT);
  const journeyData = await jnRepo.find({ where: { user: { id: userId } } });
  if (journeyData.length === 0) return { success: false, msg: "empth list of journeys" };
  const responseJourneyData = await Promise.all(
    journeyData.map(async (jn) => {
      const startDate = await setDateFromat(jn.startDate);
      const endDate = await setDateFromat(jn.endDate);
      return {
        id: jn.id,
        title: jn.title,
        startDate: startDate,
        endDate: endDate,
        thumbnail: jn.thumbnail,
      };
    }),
  ).then((res) => {
    return res.sort((a, b) => {
      if (a && b) {
        return b.id - a.id;
      } else {
        return -1;
      }
    });
  });

  return { success: true, count: responseJourneyData.length, data: responseJourneyData.slice(offset, offset + LIMIT) };
};
const getPosts = async (userId: number, pages: number) => {
  const offset = await getOffset(pages, LIMIT);
  const listResult = await postRepo.find({ where: { user: { id: userId } } });
  if (!listResult || listResult.length === 0) return { success: false, msg: "does not exist posts" };
  const responseResult = await Promise.all(
    listResult.map(async (post) => {
      return await PostsService.postsListReturnData(post);
    }),
  ).then((res) => {
    return res.sort((a, b) => {
      if (a && b) {
        return b.id - a.id;
      } else {
        return -1;
      }
    });
  });
  return { success: true, count: responseResult.length, data: responseResult.slice(offset, offset + LIMIT) };
};
const getPlaces = async (userId: number, pages: number) => {
  const offset = await getOffset(pages, LIMIT);
  const picksResult = await pickRepo.find({
    where: { user: { id: userId } },
  });
  if (!picksResult || picksResult.length === 0) return { success: false, msg: "does not exist Like Place" };
  const returnData = await Promise.all(
    picksResult.map((place) => {
      const [lat, lng] = place.place.location;
      const open: string[] = [];
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
    }),
  );
  return { success: true, count: returnData.length, data: returnData.slice(offset, offset + LIMIT) };
};
const MypagesService = { getAllUserData, getJourneysList, getPlaces, getPosts };
export default MypagesService;
