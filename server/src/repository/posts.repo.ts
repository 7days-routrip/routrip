import { AppDataSource } from "@/config/ormSetting";
import { Comments } from "@/models/comments.model";
import { Continents } from "@/models/continents.model";
import { Countries } from "@/models/countries.model";
import { Journeys } from "@/models/journeys.model";
import { Likes } from "@/models/likes.model";
import { Posts } from "@/models/posts.model";
import { Users } from "@/models/users.model";
import { getImageFromContent, getOffset, setAreaType } from "@/service/posts.service";
import { iCreatePostProps, iPageDataProps } from "@/types/posts.types";
import { Repository } from "typeorm";

export const createPost = async (inputData: iCreatePostProps, userId: number) => {
  try {
    const postsRepo = new Posts();
    postsRepo.title = inputData.title;
    postsRepo.startDate = inputData.startDate;
    postsRepo.endDate = inputData.endDate;
    postsRepo.userId = userId;
    postsRepo.continentId = inputData.continent;
    postsRepo.countryId = inputData.country;
    postsRepo.expense = String(inputData.totalExpense);
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

export const getAllPosts = async (repo: Repository<Posts>, area: string, sort: string, pageData: iPageDataProps) => {
  try {
    const offset: number = await getOffset(pageData);
    const areaType = await setAreaType(area);
    const result = await repo
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
      .where("posts.countryId =:id", { id: areaType })
      .groupBy("posts.id")
      .limit(pageData.limit)
      .offset(offset);
    if (sort === "recent" || typeof sort === "undefined") {
      return await result.orderBy("posts.id", "DESC").getRawMany();
    } else {
      return await result.orderBy({ likesNum: "DESC", "posts.id": "DESC" }).getRawMany();
    }
  } catch (err) {}
};
