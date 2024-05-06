import { AppDataSource } from "@/config/ormSetting";
import {
  BAD_REQUEST_UPLOAD_POST,
  NOT_FOUND_POSTS_LIST,
  OK_UPLOAD_POST,
  UNAUTHORIZED_NOT_LOGIN,
} from "@/constants/message";
import { Posts } from "@/models/posts.model";
import { createPost, getAllPosts } from "@/repository/posts.repo";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

//포스팅 추가
export const createPostRequest = async (req: Request, res: Response) => {
  const inputData = req.body;
  const user = req.user;
  // const userId = req.user?.id;
  const userId = 1;
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    if (!user?.isLoggedIn) throw new Error("not User");
    const createPostRequestResult = await createPost(inputData, userId);
    if (!createPostRequestResult) throw new Error("fail upload");
    res.status(StatusCodes.OK).json({ message: OK_UPLOAD_POST });
  } catch (err) {
    await queryRunner.rollbackTransaction();
    if (err instanceof Error) {
      if (err.message === "not User") res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
      if (err.message === "fail upload") res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_UPLOAD_POST });
    }
  } finally {
    await queryRunner.release();
  }
};
export const getPostsListRequset = async (req: Request, res: Response) => {
  const area = req.params.area;
  // abroad : 국외, home : 국내
  const query = req.query;
  const sort = query?.sort as string;
  const pageData = {
    pages: parseInt(query?.pages as string),
    limit: parseInt(query?.limit as string),
  };
  try {
    const postsRepo = AppDataSource.getRepository(Posts);
    const getPostsListResult = await getAllPosts(postsRepo, area, sort, pageData);
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
    res.status(StatusCodes.OK).json(responsePostsLikst);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "empty list of posts")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_POSTS_LIST });
    }
  }
};

export const getPostRequest = async (req: Request, res: Response) => {};
