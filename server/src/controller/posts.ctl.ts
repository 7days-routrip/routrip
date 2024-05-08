import { AppDataSource } from "@/config/ormSetting";
import {
  BAD_REQUEST_UPDATE_POST,
  BAD_REQUEST_UPLOAD_POST,
  NOT_FOUND_POST,
  NOT_FOUND_POSTS_LIST,
  OK_DELETE_POST,
  OK_UPDATE_POST,
  OK_UPLOAD_POST,
  UNAUTHORIZED_NOT_LOGIN,
} from "@/constants/message";
import {
  createPost,
  delPostResultRequest,
  getAllPosts,
  getJourneyData,
  getPost,
  updatepostResultRequest,
  userPostLikedCheck,
} from "@/repository/posts.repo";
import { iPagination, iSpotData } from "@/types/posts.types";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

//포스팅 추가
export const createPostRequest = async (req: Request, res: Response) => {
  const inputData = req.body;
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    if (req.user?.isLoggedIn) {
      const userId = req.user?.id;
      const createPostRequestResult = await createPost(inputData, userId);
      if (!createPostRequestResult) throw new Error("fail upload");
      res.status(StatusCodes.OK).json({ message: OK_UPLOAD_POST });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    await queryRunner.rollbackTransaction();
    if (err instanceof Error) {
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
      if (err.message === "fail upload")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_UPLOAD_POST });
    }
  } finally {
    await queryRunner.release();
  }
};
export const getPostsListRequset = async (req: Request, res: Response) => {
  const area = req.query.area as string;
  // abroad : 국외, home : 국내
  const query = req.query;
  const sort = query?.sort as string;
  const pageData = {
    pages: parseInt(query?.pages as string),
    limit: parseInt(query?.limit as string),
  };
  const searchData = {
    filter: query?.filter as string,
    keyword: query?.keyword as string,
  };

  try {
    const getPostsListResult = await getAllPosts(area, pageData, sort, searchData, "list");
    if (!getPostsListResult || getPostsListResult.length === 0) throw new Error("empty list of posts");
    const responsePostsLikst = getPostsListResult.map((value) => {
      return {
        id: value.id,
        title: value.title,
        date: value.startDate + "-" + value.endDate,
        author: value.nickName,
        userProfile: value.profileImg,
        continent: value.continent,
        country: value.country,
        commentsNum: value.commentsNum,
        likesNum: value.likesNum,
        postsImg: value.postsImg,
      };
    });
    const getTotalPostsCountResult = await getAllPosts(area, undefined, sort, searchData, "count");
    const pagination: iPagination = {};
    if (getTotalPostsCountResult) {
      (pagination.pages = pageData.pages), (pagination.totalPosts = getTotalPostsCountResult.length);
    }
    res.status(StatusCodes.OK).json({ posts: responsePostsLikst, pagination });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "empty list of posts")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_POSTS_LIST });
    }
  }
};

export const getPostRequest = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  let userId = 0;
  if (!req.user?.isLoggedIn) userId = 0;
  else userId = req.user?.id;
  try {
    const getPostResult = await getPost(postId);
    console.log("getPostResult", getPostResult);
    if (getPostResult === null) throw new Error("doen't exist posts");
    const liked: boolean = await userPostLikedCheck(userId);

    const journeyData = await getJourneyData(getPostResult[0].journeyId);
    let spot: iSpotData[][] | null;
    if (journeyData === null) {
      spot = null;
    } else {
      spot = [];
      let dayList = [];
      for (let i = 0; i < journeyData.length; i++) {
        dayList.push(journeyData[i].day);
      }
      const dayDue = new Set(dayList);
      const day = [...dayDue];
      for (let j = 0; j < day.length; j++) {
        const daySpot: iSpotData[] = [];
        for (let i = 0; i < journeyData.length; i++) {
          if (day[j] === journeyData[i].day) {
            const opening = journeyData[i].openingHours.split(",");
            const open = [];
            for (let k = 0; k < opening.length; k++) {
              open.push(opening[k].trim());
            }
            const pushData = {
              seq: journeyData[i].seq,
              placeId: journeyData[i].id,
              name: journeyData[i].name,
              tel: journeyData[i].tel,
              address: journeyData[i].address,
              openingHours: open,
            };
            daySpot.push(pushData);
          }
        }
        spot.push(daySpot);
      }
    }
    const responsePostsData = {
      id: getPostResult[0].id,
      title: getPostResult[0].title,
      author: getPostResult[0].nickName,
      userProfile: getPostResult[0].profile,
      contents: getPostResult[0].content,
      totalExpense: getPostResult[0].expense,
      date: getPostResult[0].startDate + "-" + getPostResult[0].endDate,
      continent: getPostResult[0].continent,
      country: getPostResult[0].country,
      likesNum: getPostResult[0].likesNum,
      commentsNum: getPostResult[0].commentsNum,
      liked: liked,
      journey: spot,
    };
    res.status(StatusCodes.OK).json(responsePostsData);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "doen't exist posts")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_POST });
    }
  }
};
export const editPostRequest = async (req: Request, res: Response) => {
  const data = req.body;
  const postId = req.params.id;

  try {
    if (req.user?.isLoggedIn) {
      const userId = req.user.id;
      const updatepostResult = await updatepostResultRequest(data, postId, userId);

      if (!updatepostResult) throw new Error("bad request");
      res.status(StatusCodes.OK).json({ message: OK_UPDATE_POST });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "bad request")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_UPDATE_POST });
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
    }
  }
};

export const delPostRequest = async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    const delPostResult = await delPostResultRequest(postId);
    if (!delPostResult) throw new Error("bad request");
    res.status(StatusCodes.OK).json({ message: OK_DELETE_POST });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "bad request") return res.status(StatusCodes.BAD_REQUEST).json({ message: NOT_FOUND_POST });
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
    }
  }
};
