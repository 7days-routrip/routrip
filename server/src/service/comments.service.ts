import { AppDataSource } from "@/config/ormSetting";
import { Comments } from "@/models/comments.model";

const commentRepo = AppDataSource.getRepository(Comments);
const reqCommentsList = async (postId: number) => {
  const commentList = await commentRepo.find({ where: { post: { id: postId } } });
  if (!commentList || commentList.length < 1) return { success: false, msg: "does not exist comments" };
  return { success: true, data: commentList };
};

const commentsSevice = { reqCommentsList };
export default commentsSevice;
