import CommentsController from "@/controller/comments.ctl";
import PostsController from "@/controller/posts.ctl";
import { authenticateUser } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import awsUpload from "@/middlewares/awsUpload";
import express from "express";

const router = express.Router();
router.use(express.json());

router.get("/all/hot", PostsController.postHotList);
router.get("/routrip/recommend", PostsController.postRecommendList);
router.post("/upload/img", authenticateUser, awsUpload.postsUpload.single("posts"), PostsController.postUploadImg);
router.route("/").post(authenticateUser, PostsController.postsRequest).get(PostsController.postAllList);
router
  .route("/:id")
  .get(authenticateUser, PostsController.postRequest)
  .patch(authenticateUser, authorization, PostsController.postEditRequest)
  .delete(authenticateUser, authorization, PostsController.postDelRequest);
router.get("/:postId/comments", CommentsController.postAllCommentsList);

export default router;
