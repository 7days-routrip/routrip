import { getLikesPostsList, postLikeRequest, postUnlikeRequest } from "@/controller/likes.ctl";
import express from "express";
const router = express.Router();
router.use(express.json());

router.get("/posts", getLikesPostsList);
router.route("/posts/:id").post(postLikeRequest).delete(postUnlikeRequest);

export default router;
