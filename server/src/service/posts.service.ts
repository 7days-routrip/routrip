import { AppDataSource } from "@/config/ormSetting";
import { Comments } from "@/models/comments.model";
import { Likes } from "@/models/likes.model";
import { Posts } from "@/models/posts.model";
import { iPostsInsertProps, iSearchDataProps, iSpotData, iSpots } from "@/types/posts.types";
import { getOffset, setAreaType, setDateFromat } from "@/utils/posts.utils";
import { Not } from "typeorm";
import { Journeys } from "@/models/journeys.model";
import { Routes } from "@/models/routes.model";
import { RouteDays } from "@/models/routeDays.model";
import { DaySeq } from "@/models/daySeq.model";

const postRepo = AppDataSource.getRepository(Posts);
const routeDaysRepo = AppDataSource.getRepository(RouteDays);
const daySeqRepo = AppDataSource.getRepository(DaySeq);
const reqPostInsertData = async (data: iPostsInsertProps, userId: number) => {
  const post = {
    title: data.title,
    startDate: data.startDate,
    endDate: data.endDate,
    expense: data.totalExpense,
    user: { id: userId },
    journey: { id: data.journeyId },
    continent: { id: data.continent },
    country: { id: data.country },
    content: data.contents,
    postsImg: data.postsImg,
  };

  const insertData = await postRepo.save(post);
  if (!insertData) return { success: false, msg: "failed upload" };
  return { success: true };
};
const reqAllPostsList = async (
  pages: number,
  area?: string | undefined,
  userId?: number | undefined,
  searchData?: iSearchDataProps | undefined,
  type?: string | undefined,
) => {
  const limit = 12;
  const offset = await getOffset(pages, limit);
  const areaType = await setAreaType(area as string);
  let postsData = [];
  if (area !== undefined) {
    postsData = await postRepo.find({ where: { country: { id: areaType } } });
  } else {
    postsData = await postRepo.find({ where: { user: { id: userId } } });
  }
  if (postsData.length === 0) return { success: false, msg: "empty list of posts" };

  const responsePostsData = await Promise.all(
    postsData.map(async (post) => {
      const countryId = String(post.country.id);
      if (searchData?.filter && searchData.keyword) {
        if (post.title.includes(searchData.keyword) && countryId == searchData.filter) {
          return await postsListReturnData(post);
        }
      } else if (searchData?.filter) {
        if (countryId === searchData.filter) {
          return await postsListReturnData(post);
        }
      } else if (searchData?.keyword) {
        if (post.title.includes(searchData.keyword)) {
          return await postsListReturnData(post);
        }
      }
      return await postsListReturnData(post);
    }),
  ).then((res) => {
    return res.sort((a, b) => b.id - a.id).filter((post) => post !== undefined);
  });

  return {
    success: true,
    data: responsePostsData.slice(offset, offset + limit),
    count: responsePostsData.length,
  };
};
const reqHotPosts = async () => {
  const postData = await postRepo.find();

  if (postData.length === 0) return { success: false, msg: "empty list of posts" };
  const hot10Data = await Promise.all(
    postData.map((post) => {
      return postsHot10ReturnData(post);
    }),
  ).then((res) => {
    return res.sort((a, b) => b.likesNum - a.likesNum || b.id - a.id).slice(0, 12);
  });
  return { success: true, hot10Data };
};
const reqRecommendPosts = async () => {
  const postsResult = await postRepo.find();
  const posts = await Promise.all(
    postsResult.map(async (post) => {
      if (post.user.nickName === "routrip") {
        return {
          id: post.id,
          title: post.title,
          postsImg: post.postsImg === null ? "" : post.postsImg,
        };
      }
    }),
  ).then((res) => {
    return res.slice(0, 4).filter((el) => el);
  });
  if (posts.length === 0) return { success: false, msg: "empty list of posts" };
  return { success: true, posts };
};

const reqPostData = async (postId: number, userId: number | undefined) => {
  const postData = await postRepo.findOne({ where: { id: postId } });
  if (!postData) return { success: false, msg: "does not exist post" };
  let likedPost;
  if (userId) {
    likedPost = await getLikedUser(postId, userId);
  } else {
    likedPost = false;
  }
  console.log(postData);
  const likesNum = await getPostLikes(postId);
  const commentsNum = await getPostComments(postId);
  const startDate = await setDateFromat(postData.journey.startDate);
  const endDate = await setDateFromat(postData.journey.endDate);
  const days = await routeDaysRepo.find({ where: { route: { id: postData.journey.route.id } } });
  const responsePostsData = await Promise.all(
    days.map(async (day) => {
      const spots = await daySeqRepo.find({ where: { routeDay: { id: day.id } } });
      return {
        day: day.day,
        spot: !spots
          ? []
          : spots.map((spot) => {
              const open = [];
              if (spot.place.openingHours !== null) {
                const opening = spot.place.openingHours.split(",");
                for (let k = 0; k < opening.length; k++) {
                  open.push(opening[k].trim());
                }
              }
              return {
                placeId: spot.place.id,
                name: spot.place.name,
                tel: spot.place.tel,
                address: spot.place.address,
                openingHours: open,
              };
            }),
      };
    }),
  );
  const responsePost = {
    id: postData.id,
    title: postData.title,
    author: postData.user.nickName,
    conetents: postData.content,
    totalExpense: postData.expense,
    date: startDate + "-" + endDate,
    continent: {
      id: postData.continent.id,
      name: postData.continent.name,
    },
    country: {
      id: postData.country.id,
      name: postData.country.name,
    },
    likesNum: likesNum,
    liked: userId ? likedPost : false,
    commentsNum: commentsNum,
    journeys: {
      id: postData.journey.id,
      spots: responsePostsData,
    },
  };

  return { success: true, data: responsePost };
};
const reqPostEditData = async (data: iPostsInsertProps, userId: number, postId: number) => {
  const postImg = getPostImg(data.contents);
  const postUpdateResult = await postRepo.update(postId, {
    title: data.title,
    startDate: data.startDate,
    endDate: data.endDate,
    expense: data.totalExpense,
    user: { id: userId },
    journey: { id: data.journeyId },
    continent: { id: data.continent },
    country: { id: data.country },
    content: data.contents,
    postsImg: postImg,
  });
  if (!postUpdateResult.affected || postUpdateResult.affected < 1) return { success: false, msg: "failed edit " };
  return { success: true };
};

const reqPostDelData = async (postId: number) => {
  const postDelResult = await postRepo.delete(postId);
  if (postDelResult.affected === 0) return { success: false, msg: "failed delete" };
  return { success: true };
};

const likeRepo = AppDataSource.getRepository(Likes);
const getLikedUser = async (postId: number, userId: number) => {
  return await likeRepo.existsBy({ user: { id: userId }, post: { id: postId } });
};
const getPostLikes = async (postId: number) => {
  return await likeRepo.count({ where: { post: { id: postId } } });
};
const getPostComments = async (postId: number) => {
  const commentRepo = AppDataSource.getRepository(Comments);
  return await commentRepo.count({ where: { post: { id: postId } } });
};

const getPostImg = (content: string) => {
  return undefined;
};

const reqImageUpload = async (url: string, postId: number) => {
  return await postRepo.update(postId, { postsImg: url });
};

const postsListReturnData = async (post: Posts) => {
  const likesNum = await getPostLikes(post.id);
  const commentsNum = await getPostComments(post.id);
  const startDate = await setDateFromat(post.startDate);
  const endDate = await setDateFromat(post.endDate);
  return {
    id: post.id,
    title: post.title,
    date: startDate + "-" + endDate,
    author: post.user.nickName,
    profileImg: post.user.profileImg === null ? "" : post.user.profileImg,
    continent: {
      id: post.continent.id,
      name: post.continent.name,
    },
    country: {
      id: post.country.id,
      name: post.country.name,
    },
    commentsNum: commentsNum,
    likesNum: likesNum,
    postsImg: post.postsImg === null ? "" : post.postsImg,
  };
};
const postsHot10ReturnData = async (post: Posts) => {
  const likesNum = await getPostLikes(post.id);
  const startDate = await setDateFromat(post.startDate);
  const endDate = await setDateFromat(post.endDate);
  return {
    id: post.id,
    date: startDate + "-" + endDate,
    title: post.title,
    postsImg: post.postsImg === null ? "" : post.postsImg,
    likesNum: likesNum,
    country: post.country.name,
  };
};
const PostsService = {
  reqPostInsertData,
  reqAllPostsList,
  reqPostData,
  reqPostEditData,
  reqPostDelData,
  reqImageUpload,
  reqHotPosts,
  reqRecommendPosts,
};
export default PostsService;
