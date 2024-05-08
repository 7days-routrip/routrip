import { NOT_FOUND_COMMENTS } from "@/constants/message";
import { getPostCommentsListRequest } from "@/repository/comments.repo";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
export const getPostCommentsRequest = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  try {
    const getPostCommentsListResult = await getPostCommentsListRequest(postId);
    if (!getPostCommentsListResult) throw new Error("comments do not exist");
    res.status(StatusCodes.OK).json(getPostCommentsListResult);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "comments do not exist")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_COMMENTS });
    }
  }
};
