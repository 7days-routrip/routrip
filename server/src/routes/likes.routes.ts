
import { getPlaceLikesList, placeLikeRequest, placeUnlikeRequest, getLikesPostsList, postLikeRequest, postUnlikeRequest } from "@/controller/likes.ctl";
import express from "express";
const router = express.Router();
router.use(express.json());

router.get("/places", getPlaceLikesList);
router.route("/places/:id").post(placeLikeRequest).delete(placeUnlikeRequest);

router.get("/posts", getLikesPostsList);
router.route("/posts/:id").post(postLikeRequest).delete(postUnlikeRequest);

export default router;
