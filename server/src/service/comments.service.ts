import { AppDataSource } from "@/config/ormSetting";
import { BAD_REQUEST_COMMENT, NOT_FOUND_POST } from "@/constants/message";
import { Comments } from "@/models/comments.model";
import { Posts } from "@/models/posts.model";
import { LIMIT } from "@/settings";
import { getOffset, setDateFromat } from "@/utils/posts.utils";

const commentRepo = AppDataSource.getRepository(Comments);
const reqCommentsList = async (userId: number, pages: number) => {
  const offset = await getOffset(pages, LIMIT);
  const commentList = await commentRepo.find({ where: { user: { id: userId } } });
  if (!commentList || commentList.length < 1) return { success: false, msg: "does not exist comments" };
  const retrunCmt = await Promise.all(
    commentList.map(async (cmt) => {
      if (typeof cmt.post === "undefined") {
        return {
          postId: 0,
          content: cmt.content,
          postTitle: NOT_FOUND_POST,
          createdAt: await setDateFromat(cmt.createdAt),
        };
      }
      return {
        postId: cmt.post.id,
        content: cmt.content,
        postTitle: cmt.post.title,
        createdAt: await setDateFromat(cmt.createdAt),
      };
    }),
  ).then((res) => {
    return res
      .sort((a, b) => {
        const bDate = new Date(b.createdAt).getTime();
        const aDate = new Date(a.createdAt).getTime();
        return bDate - aDate;
      })
      .filter((post) => post !== undefined);
  });

  return { success: true, data: retrunCmt.slice(offset, offset + LIMIT), count: retrunCmt.length };
};
const reqPostCommentsList = async (postId: number) => {
  const commentList = await commentRepo.find({ where: { post: { id: postId } } });
  if (!commentList || commentList.length < 1) return { success: false, msg: "does not exist comments" };
  const commentData = await Promise.all(
    commentList.map(async (comment) => {
      return {
        id: comment.id,
        content: comment.content,
        nickName: comment.user.nickName,
        profileImg: comment.user.profileImg ? comment.user.profileImg : "",
        createdAt: await setDateFromat(comment.createdAt),
      };
    }),
  );
  return { success: true, data: commentData };
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
