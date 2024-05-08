import { AppDataSource } from "@/config/ormSetting";
import { Comments } from "@/models/comments.model";
import { Continents } from "@/models/continents.model";
import { Countries } from "@/models/countries.model";
import { DaySeq } from "@/models/daySeq.model";
import { Journeys } from "@/models/journeys.model";
import { Likes } from "@/models/likes.model";
import { Places } from "@/models/places.model";
import { Posts } from "@/models/posts.model";
import { RouteDays } from "@/models/routeDays.model";
import { Routes } from "@/models/routes.model";
import { Users } from "@/models/users.model";
import { getImageFromContent, getOffset, getPostImg, setAreaType } from "@/service/posts.service";
import { iCreatePostProps, iPageDataProps, iSearchDataProps } from "@/types/posts.types";

export const createPost = async (inputData: iCreatePostProps, userId: number) => {
  try {
    const postsRepo = new Posts();
    postsRepo.title = inputData.title;
    postsRepo.startDate = inputData.startDate;
    postsRepo.endDate = inputData.endDate;
    postsRepo.userId = userId;
    postsRepo.continentId = inputData.continent;
    postsRepo.countryId = inputData.country;
    postsRepo.expense = inputData.totalExpense;
    postsRepo.journeyId = inputData.journeyId;
    postsRepo.content = inputData.contents;

    const repImage = await getImageFromContent(inputData.contents);
    postsRepo.postsImg = repImage;

    const repo = AppDataSource.getRepository(Posts);
    await repo.save(postsRepo);
    return true;
  } catch (err) {
    return false;
  }
};

export const getAllPosts = async (
  area: string,
  pageData?: iPageDataProps,
  sort?: string,
  searchData?: iSearchDataProps,
  type?: string,
) => {
  const postsRepo = AppDataSource.getRepository(Posts);
  try {
    const offset: number = await getOffset(pageData);
    const areaType = await setAreaType(area);
    const result = await postsRepo
      .createQueryBuilder("posts")
      .select([
        "posts.id, posts.title, posts.postsImg, us.nickName, us.profileImg, DATE_FORMAT(posts.startDate, '%Y.%m.%d') AS startDate, DATE_FORMAT(posts.endDate, '%Y.%m.%d') AS endDate, coun.name as country, con.name as continent",
      ])
      .addSelect((subQuery) => {
        return subQuery.select(`COUNT(*)`).from(Likes, "lk").where("lk.postId = posts.id");
      }, "likesNum")
      .addSelect((subQuery) => {
        return subQuery.select(`COUNT(*)`).from(Comments, "cm").where("cm.postId = posts.id");
      }, "commentsNum")
      .leftJoin(Users, "us", "us.id = posts.userId")
      .leftJoin(Journeys, "jn", "jn.id = posts.journeyId")
      .leftJoin(Countries, "coun", "coun.id = posts.countryId")
      .leftJoin(Continents, "con", "con.id = posts.continentId")
      .where("posts.countryId =:id", { id: areaType });
    if (searchData?.filter) {
      await result.andWhere("country like :filter", { filter: `%${searchData.filter}%` });
    } else if (searchData?.keyword) {
      await result.andWhere("posts.title like :keyword", { keyword: `%${searchData.keyword}%` });
    } else if (searchData?.filter && searchData?.keyword) {
      await result.andWhere("country like :filter", { filter: `%${searchData?.filter}%` });
      await result.andWhere("posts.title like :keyword", { keyword: `%${searchData?.keyword}%` });
    }
    await result.groupBy("posts.id");

    if (sort === "recent" || typeof sort === "undefined") {
      await result.orderBy("posts.id", "DESC");
    } else {
      await result.orderBy({ likesNum: "DESC", "posts.id": "DESC" });
    }
    if (type && type == "list") {
      return await result.limit(pageData?.limit).offset(offset).getRawMany();
    } else {
      return await result.getRawMany();
    }
  } catch (err) {
    return null;
  }
};
export const getPost = async (postId: number) => {
  const postsRepo = AppDataSource.getRepository(Posts);
  try {
    const result = await postsRepo
      .createQueryBuilder("posts")
      .select([
        "posts.id, posts.title, posts.postsImg, posts.content, posts.expense,posts.journeyId, us.nickName, us.profileImg, DATE_FORMAT(posts.startDate, '%Y.%m.%d') AS startDate, DATE_FORMAT(posts.endDate, '%Y.%m.%d') AS endDate, coun.name as country, con.name as continent",
      ])
      .addSelect((subQuery) => {
        return subQuery.select(`COUNT(*)`).from(Likes, "lk").where("lk.postId = posts.id");
      }, "likesNum")
      .addSelect((subQuery) => {
        return subQuery.select(`COUNT(*)`).from(Comments, "cm").where("cm.postId = posts.id");
      }, "commentsNum")
      .leftJoin(Users, "us", "us.id = posts.userId")
      .leftJoin(Journeys, "jn", "jn.id = posts.journeyId")
      .leftJoin(Countries, "coun", "coun.id = posts.countryId")
      .leftJoin(Continents, "con", "con.id = posts.continentId")
      .where("posts.id =:id", { id: postId })
      .getRawMany();

    if (result.length === 0) throw new Error("no Data");
    return result;
  } catch (err) {
    return null;
  }
};

export const getJourneyData = async (journeyId: number) => {
  const repo = AppDataSource.getRepository(Journeys);
  try {
    const result = await repo
      .createQueryBuilder("j")
      .select(["j.id, rd.day, ds.seq, place.name, place.address, place.tel, place.id, place.openingHours"])
      .leftJoin(Routes, "rt", "rt.id = j.routeId")
      .leftJoin(RouteDays, "rd", "rd.routeId = rt.id")
      .leftJoin(DaySeq, "ds", "ds.routeDayId = rd.id")
      .leftJoin(Places, "place", "place.id = ds.placeId")
      .where("j.id =:id", { id: journeyId })
      .getRawMany();
    return result;
  } catch (err) {
    return null;
  }
};
export const userPostLikedCheck = async (userId: number) => {
  const repo = AppDataSource.getRepository(Likes);
  if (userId) return await repo.existsBy({ userId: userId });
  return false;
};

export const updatepostResultRequest = async (updateData: iCreatePostProps, postId: string, userId: number) => {
  const repository = AppDataSource.getRepository(Posts);
  try {
    const postImg = await getImageFromContent(updateData.contents);
    console.log(postImg);
    const result = await repository
      .createQueryBuilder()
      .update(Posts)
      .set({
        title: updateData.title,
        content: updateData.contents,
        postsImg: postImg,
        expense: updateData.totalExpense,
        journeyId: updateData.journeyId,
        continentId: updateData.continent,
        countryId: updateData.country,
        startDate: updateData.startDate,
        endDate: updateData.endDate,
      })
      .where("id = :id", { id: postId })
      .execute();

    if (result.affected !== 1) throw new Error("bad request");
    return true;
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "bad request") return false;
    }
  }
};
export const delPostResultRequest = async (postId: string) => {
  const repository = AppDataSource.getRepository(Posts);
  try {
    const result = await repository
      .createQueryBuilder()
      .delete()
      .from(Posts)
      .where("id = :id", { id: postId })
      .execute();

    if (result.affected === 0) throw new Error("bad request");
    return true;
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "bad request") return false;
    }
  }
};
