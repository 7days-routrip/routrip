import { AppDataSource } from "@/config/ormSetting";
import { Comments } from "@/models/comments.model";
import { Likes } from "@/models/likes.model";
import { Posts } from "@/models/posts.model";
import PostsRepository from "@/repository/posts.repo";
import { iPostsInsertProps, iSearchDataProps, iSpotData, iSpots } from "@/types/posts.types";
import { setDateFromat } from "@/utils/posts.utils";
import journeysRepository from "@/repository/journeys.repo";

const postRepo = AppDataSource.getRepository(Posts);
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
  area?: string,
  userId?: number,
  sort?: string,
  searchData?: iSearchDataProps,
  type?: string,
) => {
  const postsResult = await PostsRepository.getAllPosts(pages, area, userId, sort, searchData, type);
  if (postsResult === null) return { success: false, msg: "empty list of posts" };
  if (typeof postsResult == "number") {
    return { success: true, count: postsResult };
  }

  const responsePostsData = await Promise.all(
    postsResult.map(async (post) => {
      const startDate = await setDateFromat(post.startDate);
      const endDate = await setDateFromat(post.endDate);
      return {
        id: post.id,
        title: post.title,
        date: startDate + "-" + endDate,
        author: post.nickName,
        userProfile: post.profileImg,
        continent: post.continent,
        country: post.country,
        commentsNum: post.commentsNum,
        likesNum: post.likesNum,
        postsImg: post.postsImg,
      };
    }),
  );
  return { success: true, data: responsePostsData };
};
const reqHotPosts = async () => {
  const postsResult = await PostsRepository.getPosts();
  if (postsResult === null) return { success: false, msg: "empty list of posts" };
  const posts = await Promise.all(
    postsResult.map(async (post) => {
      return {
        id: post.id,
        date: (await setDateFromat(post.startDate)) + "-" + (await setDateFromat(post.endDate)),
        title: post.title,
        postsImg: post.postsImg === null ? "" : post.postsImg,
        likesNum: post.likesNum,
        country: post.country,
      };
    }),
  ).then((res) => {
    return res.sort((a, b) => b.likesNum - a.likesNum || b.id - a.id).slice(0, 12);
  });
  return { success: true, posts };
};
const reqRecommendPosts = async () => {
  const postsResult = await PostsRepository.getPosts();
  if (postsResult === null) return { success: false, msg: "empty list of posts" };
  const posts = await Promise.all(
    postsResult.map(async (post) => {
      if (post.nickName === "routrip") {
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
  const journey = await journeysRepository.getJourneyData(postData.journey.route.id);
  let spots: iSpots[] | null;
  if (journey === null) {
    spots = null;
  } else {
    spots = [];
    let dayList = [];
    for (let i = 0; i < journey.length; i++) {
      dayList.push(journey[i].day);
    }
    const dayDue = new Set(dayList);
    const day = [...dayDue];
    for (let j = 0; j < day.length; j++) {
      const daySpot: iSpotData[] = [];
      for (let i = 0; i < journey.length; i++) {
        if (day[j] === journey[i].day) {
          const open = [];
          if (journey[i].openingHours !== null) {
            const opening = journey[i].openingHours.split(",");
            for (let k = 0; k < opening.length; k++) {
              open.push(opening[k].trim());
            }
          }
          const pushData = {
            placeId: journey[i].placeId,
            name: journey[i].name,
            tel: journey[i].tel,
            address: journey[i].address,
            openingHours: open,
          };
          daySpot.push(pushData);
        }
      }
      const result = {
        day: j + 1,
        spot: daySpot,
      };
      spots.push(result);
    }
  }

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
      spots: spots,
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
