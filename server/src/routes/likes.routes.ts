import likesController from "@/controller/likes.ctl";
import { authenticateUser } from "@/middlewares/authentication";
import { authorizeLikes, authorizePicks } from "@/middlewares/authorization";
import express from "express";
const router = express.Router();
router.use(express.json());

router.get("/places", authenticateUser, likesController.likesPlaceAllData);
router
  .route("/places/:id")
  .post(authenticateUser, likesController.placeLikeRequest)
  .delete(authenticateUser, authorizePicks, likesController.placeUnlikeRequest);

router.get("/posts", authenticateUser, likesController.likesPostAllData);
router
  .route("/posts/:id")
  .post(authenticateUser, authorizeLikes, likesController.postLikeRequest)
  .delete(authenticateUser, authorizeLikes, likesController.postUnlikeRequest);

export default router;
