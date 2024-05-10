import commentsController from "@/controller/comments.ctl";
import postsController from "@/controller/posts.ctl";
import { authenticateUser } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import express from "express";

const router = express.Router();
router.use(express.json());

router.route("/").post(authenticateUser, postsController.postsRequest).get(postsController.postAllList);
router
  .route("/:id")
  .get(authenticateUser, postsController.postRequest)
  .patch(authenticateUser, authorization, postsController.postEditRequest)
  .delete(authenticateUser, authorization, postsController.postDelRequest);
router.get("/:postId/comments", commentsController.postAllCommentsList);

export default router;
