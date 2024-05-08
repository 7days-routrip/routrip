import { AppDataSource } from "@/config/ormSetting";
import { Likes } from "@/models/likes.model";
import { Picks } from "@/models/picks.model";
import { Places } from "@/models/places.model";
import { Posts } from "@/models/posts.model";
import { ObjectLiteral, Repository } from "typeorm";

export const postLikeListRequest = async (userId: number) => {
  const repository = AppDataSource.getRepository(Posts);
  try {
    const listResult =
      await repository.query(`select posts.id, posts.title, posts.startDate, posts.endDate, posts.postsImg, continents.name as continent, countries.name as country, users.nickName,users.profileImg,
    (select count(*) from comments where comments.postId = posts.id) as commentsNum,
    (select count(*) from likes where likes.postId = posts.id) as likesNum from posts
    left join likes on likes.postId = posts.id
    left join continents on posts.continentId = continents.id
    left join countries on posts.countryId = countries.id
    left join users on users.id = posts.userId
    where likes.userId = ${userId}
    group by id`);

    return listResult;
  } catch (err) {
    console.log(err);
  }
};

export const PlaceLikesListResult = async (userId: number) => {
  const repository = AppDataSource.getRepository(Picks);
  try {
    const result = await repository
      .createQueryBuilder("pick")
      .select(["place.id, place.name, place.address, place.location, place.tel, place.img"])
      .leftJoin(Places, "place", "pick.placeId = place.id")
      .where("pick.userId = :id", { id: userId })
      .getRawMany();
    return result;
  } catch (err) {
    return false;
  }
};

export const placeUnlikeRequestResult = async (userId: number, placeId: string) => {
  const repository = AppDataSource.getRepository(Picks);
  try {
    const result = await repository.delete({
      userId: userId,
      placeId: placeId,
    });
    if (result.affected === 0) throw new Error("failed");
    return true;
  } catch (err) {
    return false;
  }
};

export const placeLikeRequestResult = async (userId: number, placeId: string) => {
  const repository = AppDataSource.getRepository(Picks);
  try {
    const result = await repository.insert({
      userId: userId,
      placeId: placeId,
    });
    if (result.generatedMaps[0].id) return true;
  } catch (err) {
    return false;
  }
};

export const alreadyLikePlaceCheck = async (userId: number, placeId: string) => {
  const repository = AppDataSource.getRepository(Picks);
  try {
    const result = await repository
      .createQueryBuilder("check")
      .where("check.userId = :userId", { userId: userId })
      .andWhere("check.placeId = :placeId", { placeId: placeId })
      .getRawOne();

    if (result) throw new Error("already like place");
    return true;
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "already like place") return false;
    }
  }
};

export const alreadyLikePostCheck = async (repo: Repository<Likes>, userId: number, postId: number) => {
  try {
    const repository = repo;
    const result = await repository
      .createQueryBuilder("likes")
      .where("likes.userId = :userId", { userId: userId })
      .andWhere("likes.postId = :postId", { postId: postId })
      .getRawOne();
    if (result) throw new Error("already exist");
    return true;
  } catch (err) {
    return false;
  }
};

export const postLikeRequestResult = async (repo: Repository<Likes>, userId: number, postId: number) => {
  try {
    const repository = repo;
    const result = await repository.insert({
      userId: userId,
      postId: postId,
    });
    return result;
  } catch (err) {
    return false;
  }
};

export const postUnlikeRequestResult = async (repo: Repository<Likes>, userId: number, postId: number) => {
  try {
    const repository = repo;
    const result = await repository.delete({
      userId: userId,
      postId: postId,
    });
    return result.affected;
  } catch (err) {
    return false;
  }
};
