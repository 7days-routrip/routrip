import { AppDataSource } from "@/config/ormSetting";
import { NOT_FOUND_USER_LIKES_POST } from "@/constants/message";
import { Posts } from "@/models/posts.model";
import { postLikeListRequest } from "@/repository/likes.repo";
import { iListMapData } from "@/types/likes.types";
import { setDate } from "@/utils/common";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

// const queryRunner = AppDataSource.createQueryRunner();
// queryRunner.connect();
export const getLikesPostsList = async (req: Request, res: Response) => {
  const postsRepo = AppDataSource.getRepository(Posts);
  // const userId = req.user.id;
  const userId = 1;

  const postLikeListResult = await postLikeListRequest(postsRepo, userId);
  if (postLikeListResult.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_USER_LIKES_POST });
  }
  const result = postLikeListResult.map((list: iListMapData) => {
    const startDate = setDate(list.startDate);
    const endDate = setDate(list.endDate);
    const data = {
      id: list.id,
      author: list.nickName,
      profileImg: list.profileImg,
      title: list.title,
      date: startDate + "~" + endDate,
      continent: list.continent,
      country: list.country,
      postsImg: list.postsImg,
      commentsNum: list.commentsNum,
      likesNum: list.likesNum,
    };
    return data;
  });
  res.status(StatusCodes.OK).json(result);
};
export const postLikeRequest = () => {};
export const postUnlikeRequest = () => {};

// const listResult = await likesRepo
//   .createQueryBuilder("likes")
//   .leftJoin("likes.userId", "users")
//   .leftJoin("likes.postId", "posts")
//   .leftJoin("posts.continentId", "continents")
//   .leftJoin("posts.countryId", "countries")
//   .select(["posts.id", "users.nickName", "users.profileImg", "continents.name", "countries.name", "posts.postsImg","posts.startDate", "posts.endDate", "posts.createdAt"])
//   .where("likes.userId = :id", { id: userId })
//   .getRawMany();
