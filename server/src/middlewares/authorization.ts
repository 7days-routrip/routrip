import { AppDataSource } from "@/config/ormSetting";
import { NOT_FOUND_DATA, NOT_FOUND_POST, UNAUTHORIZED_NOT_LOGIN } from "@/constants/message";
import { Comments } from "@/models/comments.model";
import { Journeys } from "@/models/journeys.model";
import { Likes } from "@/models/likes.model";
import { Picks } from "@/models/picks.model";
import { Posts } from "@/models/posts.model";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Repository, TreeLevelColumn } from "typeorm";

const setRepo = (type: string) => {
  let repo;
  switch (type) {
    case "picks":
      repo = AppDataSource.getRepository(Picks);
      break;
    case "journeys":
      repo = AppDataSource.getRepository(Journeys);
      break;
    case "comments":
      repo = AppDataSource.getRepository(Comments);
      break;
    case "posts":
      repo = AppDataSource.getRepository(Posts);
      break;
    case "likes":
      repo = AppDataSource.getRepository(Likes);
      break;
  }
  return repo;
};
const authorizeLikes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.isLoggedIn) {
      const postId: number = parseInt(req.params.id);
      const userId = req.user.id as number;

      //중복체크
      const postRepo = setRepo("posts") as Repository<Posts>;
      const postCheck = await postRepo.findOne({
        where: { id: postId },
      });
      if (postCheck === null) throw new Error("post does not exist");
      //
      const likeRepo = setRepo("likes") as Repository<Likes>;
      const findData = await likeRepo.find({
        where: { post: { id: postId }, user: { id: userId } },
      });
      if (!findData) throw new Error("잘못된 접근입니다.");
      next();
    } else {
      throw new Error("user does not login");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "잘못된 접근입니다.") {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: err.message,
        });
      }
      if (err.message === "user does not login") {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: UNAUTHORIZED_NOT_LOGIN,
        });
      }
      if (err.message === "post does not exist") {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: NOT_FOUND_POST,
        });
      }
    }
  }
};
const authorizePicks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.isLoggedIn) {
      const placeId: string = req.params.id;
      const userId = req.user.id as number;
      let repo = (await setRepo("picks")) as Repository<Picks>;
      const findData = await repo
        ?.createQueryBuilder("picks")
        .select(["picks.userId, picks.placeId"])
        .where("placeId = :id", { id: placeId })
        .getRawMany();
      let isChecked = false;
      findData.map((item) => {
        if (item.userId === userId) {
          isChecked = true;
        }
      });
      if (!findData || isChecked === false) throw new Error("잘못된 접근입니다.");
      next();
    } else {
      throw new Error("user does not login");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "잘못된 접근입니다.") {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: err.message,
        });
      }
      if (err.message === "user does not login") {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: UNAUTHORIZED_NOT_LOGIN,
        });
      }
    }
  }
};
const authorization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.isLoggedIn) {
      console.log(req.user);
      const itemId: number = parseInt(req.params.id);
      const userId = req.user.id as number;
      let repo;
      if (req.baseUrl.includes("journeys")) {
        repo = (await setRepo("journeys")) as Repository<Journeys>;
      } else if (req.baseUrl.includes("comments")) {
        repo = (await setRepo("comments")) as Repository<Comments>;
      } else if (req.baseUrl.includes("posts")) {
        repo = (await setRepo("posts")) as Repository<Posts>;
      }
      const findData = await repo
        ?.createQueryBuilder("create")
        .select(["create.id, create.userId"])
        .where("create.id = :id", { id: itemId })
        .getRawOne();
      if (!findData) throw new Error("does not exist data");
      if (findData.userId !== userId) throw new Error("잘못된 접근입니다.");
      next();
    } else {
      throw new Error("user does not login");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "잘못된 접근입니다.") {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: err.message,
        });
      }
      if (err.message === "does not exist data") {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: NOT_FOUND_DATA,
        });
      }
      if (err.message === "user does not login") {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: UNAUTHORIZED_NOT_LOGIN,
        });
      }
    }
  }
};

export { authorization, authorizePicks, authorizeLikes };
