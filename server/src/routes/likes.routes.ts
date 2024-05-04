import { getPlaceLikesList, placeLikeRequest, placeUnlikeRequest } from "@/controller/likes.ctl";
import express from "express";

const router = express.Router();
router.use(express.json());

router.get("/places", getPlaceLikesList);
router.route("/places/:id").post(placeLikeRequest).delete(placeUnlikeRequest);

export default router;
