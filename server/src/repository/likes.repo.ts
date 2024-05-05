import { Posts } from "@/models/posts.model";
import { Repository } from "typeorm";

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
