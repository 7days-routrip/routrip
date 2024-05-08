import { AppDataSource } from "@/config/ormSetting";
import { Comments } from "@/models/comments.model";
import { Users } from "@/models/users.model";
const repo = AppDataSource.getRepository(Comments);
export const getPostCommentsListRequest = async (postId: number) => {
  try {
    const result = await repo
      .createQueryBuilder("cm")
      .select(["us.nickName, us.profileImg, cm.content, cm.createdAt"])
      .leftJoin(Users, "us", "cm.userId = us.id")
      .where("cm.postId = :id", { id: postId })
      .getRawMany();

    if (result.length < 1) throw new Error("comments do not exist");
    return result;
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "comments do not exist") return false;
    }
  }
};
