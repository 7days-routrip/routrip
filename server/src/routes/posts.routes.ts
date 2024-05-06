import { createPostRequest, getPostRequest, getPostsListRequset } from "@/controller/posts.ctl";
import express from "express";

const router = express.Router();
router.use(express.json());

router.route("/").post(createPostRequest);
router.route("/:area").get(getPostsListRequset);
router.route("/:area/:id").get(getPostRequest);

export default router;
