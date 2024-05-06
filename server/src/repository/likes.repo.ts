import { Likes } from "@/models/likes.model";
import { Posts } from "@/models/posts.model";
import { ObjectLiteral, Repository } from "typeorm";

export const postLikeListRequest = async (repo: Repository<Posts>, userId: number) => {
  try {
    const listResult =
      await repo.query(`select posts.id, posts.title, posts.startDate, posts.endDate, posts.postsImg, continents.name as continent, countries.name as country, users.nickName,users.profileImg,
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

export const PlaceLikesListResult = async (repo: Repository<ObjectLiteral>, userId: number) => {
  const repository = repo;
  try {
    const result = await repository
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.placeId", "places")
      .where("p.userId = :id", { id: userId })
      .getRawMany();
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const placeUnlikeRequestResult = async (repo: Repository<ObjectLiteral>, userId: number, placeId: number) => {
  const repository = repo;
  try {
    const result = await repository.delete({
      userId: userId,
      placeId: placeId,
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const placeLikeRequestResult = async (repo: Repository<ObjectLiteral>, userId: number, placeId: number) => {
  const repository = repo;
  try {
    const result = await repository.insert({
      userId: userId,
      placeId: placeId,
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const alreadyLikePlaceCheck = async (repo: Repository<ObjectLiteral>, userId: number, placeId: number) => {
  const repository = repo;
  try {
    const result = await repository
      .createQueryBuilder("check")
      .where("check.userId = :userId", { userId: userId })
      .andWhere("check.placeId = :placeId", { placeId: placeId })
      .getRawOne();

    return result;
  } catch (err) {
    console.log(err);
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
    console.log(err);
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
