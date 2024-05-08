import { createPostRequest, editPostRequest, getPostRequest, getPostsListRequset } from "@/controller/posts.ctl";
import express from "express";

const router = express.Router();
router.use(express.json());

router.route("/").post(createPostRequest).get(getPostsListRequset);
router.route("/:id").get(getPostRequest).put(editPostRequest);

export default router;
