import { getPostCommentsRequest } from "@/controller/comments.ctl";
import {
  createPostRequest,
  delPostRequest,
  editPostRequest,
  getPostRequest,
  getPostsListRequset,
} from "@/controller/posts.ctl";
import { authenticateUser } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import express from "express";

const router = express.Router();
router.use(express.json());

router.route("/").post(authenticateUser, createPostRequest).get(getPostsListRequset);
router
  .route("/:id")
  .get(authenticateUser, getPostRequest)
  .patch(authenticateUser, authorization, editPostRequest)
  .delete(authenticateUser, authorization, delPostRequest);
router.get("/:postId/comments", getPostCommentsRequest);

export default router;
