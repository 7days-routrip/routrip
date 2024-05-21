import { AppDataSource } from "@/config/ormSetting";
import { Comments } from "@/models/comments.model";
import { DaySeq } from "@/models/daySeq.model";
import { Likes } from "@/models/likes.model";
import { Posts } from "@/models/posts.model";
import { RouteDays } from "@/models/routeDays.model";
import { LIMIT } from "@/settings";
import { iPostsInsertProps, iSearchDataProps } from "@/types/posts.types";
import { getOffset, setAreaType, setDateFromat } from "@/utils/posts.utils";

const postRepo = AppDataSource.getRepository(Posts);
const routeDaysRepo = AppDataSource.getRepository(RouteDays);
const daySeqRepo = AppDataSource.getRepository(DaySeq);
const reqPostInsertData = async (data: iPostsInsertProps, userId: number) => {
  const post = {
    title: data.title,
    startDate: data.startDate,
    endDate: data.endDate,
    expense: data.expense,
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
  const offset = await getOffset(pages, LIMIT);
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
      const countryId = post.country.id;
      if (post.user.nickName !== "Routrip") {
        if (searchData?.filter && searchData.keyword) {
          if (post.title.includes(searchData.keyword) && countryId === parseInt(searchData.filter)) {
            return await postsListReturnData(post);
          }
        } else if (searchData?.filter) {
          if (countryId === parseInt(searchData.filter)) {
            return await postsListReturnData(post);
          }
        } else if (searchData?.keyword) {
          if (post.title.includes(searchData.keyword)) {
            return await postsListReturnData(post);
          }
        } else {
          return await postsListReturnData(post);
        }
      }
    }),
  ).then((res) => {
    return res
      .sort((a, b) => {
        if (a && b) {
          return b.id - a.id;
        } else {
          return -1;
        }
      })
      .filter((post) => post !== undefined);
  });

  return {
    success: true,
    count: responsePostsData.length,
    data: responsePostsData.slice(offset, offset + LIMIT),
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
  const likesNum = await getPostLikes(postId);
  const commentsNum = await getPostComments(postId);
  const startDate = await setDateFromat(postData.startDate);
  const endDate = await setDateFromat(postData.endDate);
  const createdAt = await setDateFromat(postData.createdAt);
  let jouneyData = {};
  if (postData.journey === null) {
  } else {
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
                  openingHours: open[0] === "" ? [] : open,
                };
              }),
        };
      }),
    );
    jouneyData = {
      id: postData.journey.id,
      spots: responsePostsData,
    };
  }
  const responsePost = {
    id: postData.id,
    title: postData.title,
    author: postData.user.nickName,
    contents: postData.content,
    totalExpense: postData.expense,
    date: startDate + "-" + endDate,
    createdAt: createdAt,
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
    journeys: jouneyData,
  };

  return { success: true, data: responsePost };
};
const reqPostEditData = async (data: iPostsInsertProps, userId: number, postId: number) => {
  const postImg = getPostImg(data.contents);
  const postUpdateResult = await postRepo.update(postId, {
    title: data.title,
    startDate: data.startDate,
    endDate: data.endDate,
    expense: data.expense,
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

const postsListReturnData = async (post: Posts) => {
  const likesNum = await getPostLikes(post.id);
  const commentsNum = await getPostComments(post.id);
  const startDate = await setDateFromat(post.startDate);
  const endDate = await setDateFromat(post.endDate);
  const createdAt = await setDateFromat(post.createdAt);
  return {
    id: post.id,
    title: post.title,
    date: startDate + "-" + endDate,
    createdAt: createdAt,
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
    country: {
      id: post.country.id,
      name: post.country.name,
    },
  };
};
const PostsService = {
  reqPostInsertData,
  reqAllPostsList,
  reqPostData,
  reqPostEditData,
  reqPostDelData,
  // reqImageUpload,
  reqHotPosts,
  reqRecommendPosts,
};
export default PostsService;
