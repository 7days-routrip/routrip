import { AppDataSource } from "@/config/ormSetting";
import { BAD_REQUEST_COMMENT, NOT_FOUND_POST } from "@/constants/message";
import { Comments } from "@/models/comments.model";
import { Posts } from "@/models/posts.model";
import { setDateFromat } from "@/utils/posts.utils";

const commentRepo = AppDataSource.getRepository(Comments);
const reqCommentsList = async (userId: number) => {
  const commentList = await commentRepo.find({ where: { user: { id: userId } } });
  if (!commentList || commentList.length < 1) return { success: false, msg: "does not exist comments" };
  const retrunCmt = await Promise.all(
    commentList.map(async (cmt) => {
      if (typeof cmt.post === "undefined") {
        return {
          postId: undefined,
          content: cmt.content,
          postTitle: NOT_FOUND_POST,
          createDate:
            cmt.createdAt === cmt.updatedAt ? await setDateFromat(cmt.createdAt) : await setDateFromat(cmt.updatedAt),
        };
      }
      return {
        postId: cmt.post.id,
        content: cmt.content,
        postTitle: cmt.post.title,
        createDate: cmt.createdAt === cmt.updatedAt ? setDateFromat(cmt.createdAt) : setDateFromat(cmt.updatedAt),
      };
    }),
  );
  return { success: true, data: retrunCmt };
};
const reqPostCommentsList = async (postId: number) => {
  const commentList = await commentRepo.find({ where: { post: { id: postId } } });
  if (!commentList || commentList.length < 1) return { success: false, msg: "does not exist comments" };
  return { success: true, data: commentList };
};

const addComment = async (userId: number, postId: number, content: string) => {
  const postRepo = AppDataSource.getRepository(Posts);
  const post = await postRepo.findOne({ where: { id: postId } });

  if (!post) throw new Error(BAD_REQUEST_COMMENT);
  const comment = {
    content,
    user: { id: userId },
    post: { id: postId },
  };
  const result = await commentRepo.save(comment);

  return result;
};

const updateComment = async (userId: number, postId: number, content: string, commentId: number) => {
  const comment = await commentRepo.findOne({ where: { id: commentId, post: { id: postId }, user: { id: userId } } });
  console.log(comment);
  if (!comment) throw new Error(BAD_REQUEST_COMMENT);
  comment.content = content;
  const result = await commentRepo.save(comment);
  return result;
};

const deleteComment = async (userId: number, commentId: number) => {
  const comment = await commentRepo.findOne({ where: { id: commentId, user: { id: userId } } });
  if (!comment) throw new Error(BAD_REQUEST_COMMENT);
  const result = await commentRepo.remove(comment);
  return result;
};

const CommentsService = { reqPostCommentsList, reqCommentsList, addComment, updateComment, deleteComment };
export default CommentsService;
