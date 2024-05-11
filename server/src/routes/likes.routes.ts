import LikesController from "@/controller/likes.ctl";
import { authenticateUser } from "@/middlewares/authentication";
import { authorizeLikes, authorizePicks } from "@/middlewares/authorization";
import express from "express";
const router = express.Router();
router.use(express.json());

router.get("/places", authenticateUser, LikesController.likesPlaceAllData);
router
  .route("/places/:id")
  .post(authenticateUser, LikesController.placeLikeRequest)
  .delete(authenticateUser, authorizePicks, LikesController.placeUnlikeRequest);

router.get("/posts", authenticateUser, LikesController.likesPostAllData);
router
  .route("/posts/:id")
  .post(authenticateUser, authorizeLikes, LikesController.postLikeRequest)
  .delete(authenticateUser, authorizeLikes, LikesController.postUnlikeRequest);

export default router;
