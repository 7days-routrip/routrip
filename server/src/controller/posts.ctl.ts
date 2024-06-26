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
import PostsService from "@/service/posts.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const postsRequest = async (req: Request, res: Response) => {
  const inputData = req.body;
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    if (req.user?.isLoggedIn) {
      const userId = req.user.id as number;
      const dataResult = await PostsService.reqPostInsertData(inputData, userId);
      if (!dataResult.success) throw new Error(dataResult.msg);
      res.status(StatusCodes.OK).json({ message: OK_UPLOAD_POST });
      queryRunner.commitTransaction();
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    await queryRunner.rollbackTransaction();
    if (err instanceof Error) {
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
      if (err.message === "failed upload")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_UPLOAD_POST });
    }
  }
};
const postAllList = async (req: Request, res: Response) => {
  try {
    const area = req.query.area as string;
    // abroad : 국외, home : 국내
    const query = req.query;
    const sort = query?.sort as string;
    const pages = parseInt(query?.pages as string);
    const searchData = {
      filter: query?.filter as string,
      keyword: query?.keyword as string,
    };
    const listResult = await PostsService.reqAllPostsList(pages, area, undefined, searchData, "list");
    if (listResult.success === false) throw new Error(listResult.msg);
    res.status(StatusCodes.OK).json({
      posts: listResult.data,
      pagination: {
        page: pages,
        totalItems: listResult.count,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
      if (err.message === "empty list of posts")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_POSTS_LIST });
    }
  }
};
const postRequest = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    let userId = undefined;
    if (req.user?.isLoggedIn) {
      userId = req.user.id;
    }
    const postResult = await PostsService.reqPostData(postId, userId);
    if (!postResult.success) throw new Error(postResult.msg);
    res.status(StatusCodes.OK).json(postResult.data);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "does not exist post")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_POST });
    }
  }
};
const postEditRequest = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const postId = parseInt(req.params.id) as number;
    const userId = req.user?.id as number;
    if (req.user?.isLoggedIn) {
      const editResult = await PostsService.reqPostEditData(data, userId, postId);
      if (!editResult.success) throw new Error(editResult.msg);
      res.status(StatusCodes.OK).json({ message: OK_UPDATE_POST });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
      if (err.message === "failed edit")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_UPDATE_POST });
    }
  }
};
const postDelRequest = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id) as number;
    if (req.user?.isLoggedIn) {
      const delResult = await PostsService.reqPostDelData(postId);
      if (!delResult.success) throw new Error(delResult.msg);
      res.status(StatusCodes.OK).json({ message: OK_DELETE_POST });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
      if (err.message === "failed delete")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: UNAUTHORIZED_NOT_LOGIN });
    }
  }
};
const postUploadImg = async (req: Request, res: Response) => {
  try {
    if (req.user?.isLoggedIn) {
      const file = req.file as Express.MulterS3.File;
      res.status(StatusCodes.OK).json({
        url: file.location,
      });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === ("login required" || "user does not exist"))
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
    }
  }
};

const postHotList = async (req: Request, res: Response) => {
  try {
    const listResult = await PostsService.reqHotPosts();
    if (!listResult.success) throw new Error(listResult.msg);
    const { hot10Data } = listResult;
    res.status(StatusCodes.OK).json(hot10Data);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "empty list of posts")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_POSTS_LIST });
    }
  }
};
const postRecommendList = async (req: Request, res: Response) => {
  try {
    const listResult = await PostsService.reqRecommendPosts();
    if (!listResult.success) throw new Error(listResult.msg);
    const { posts } = listResult;
    res.status(StatusCodes.OK).json(posts);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "empty list of posts")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_POSTS_LIST });
    }
  }
};

const postsController = {
  postsRequest,
  postAllList,
  postRequest,
  postEditRequest,
  postDelRequest,
  postUploadImg,
  postHotList,
  postRecommendList,
};

export default postsController;
