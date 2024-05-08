import {
  createPostRequest,
  delPostRequest,
  editPostRequest,
  getPostRequest,
  getPostsListRequset,
} from "@/controller/posts.ctl";
import { authorization } from "@/middlewares/authorization";
import express from "express";

const router = express.Router();
router.use(express.json());

router.route("/").post(createPostRequest).get(getPostsListRequset);
router.route("/:id").get(getPostRequest).put(authorization, editPostRequest).delete(authorization, delPostRequest);

export default router;
