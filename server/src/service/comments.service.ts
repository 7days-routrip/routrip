import { AppDataSource } from "@/config/ormSetting";
import { Comments } from "@/models/comments.model";
import { Posts } from "@/models/posts.model";

const commentRepo = AppDataSource.getRepository(Comments);
const reqCommentsList = async (userId: number) => {
  const commentList = await commentRepo.find({ where: { user: { id: userId } } });
  if (!commentList || commentList.length < 1) return { success: false, msg: "does not exist comments" };
  return { success: true, data: commentList };
};
const reqPostCommentsList = async (postId: number) => {
  const commentList = await commentRepo.find({ where: { post: { id: postId } } });
  if (!commentList || commentList.length < 1) return { success: false, msg: "does not exist comments" };
  return { success: true, data: commentList };
};

const addComment = async (userId: number, postId: number, content: string) => {
  const postRepo = AppDataSource.getRepository(Posts);
  const post = await postRepo.findOne({ where: { id: postId } });

  if (!post) throw new Error("잘못된 요청입니다.");
  const comment = {
    content,
    user: { id: userId },
    post: { id: postId },
  };
  const result = await commentRepo.save(comment);

  return result;
};

const CommentsService = { reqPostCommentsList, reqCommentsList, addComment };
export default CommentsService;
