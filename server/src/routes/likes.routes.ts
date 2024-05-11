// import {
//   getLikesPostsList,
//   getPlaceLikesList,
//   placeLikeRequest,
//   placeUnlikeRequest,
//   postLikeRequest,
//   postUnlikeRequest,
// } from "@/controller/likes.ctl";
import { authenticateUser } from "@/middlewares/authentication";
import { authorization, authorizeLikes, authorizePicks } from "@/middlewares/authorization";
import express from "express";
const router = express.Router();
router.use(express.json());

// router.get("/places", authenticateUser, getPlaceLikesList);
// router
//   .route("/places/:id")
//   .post(authenticateUser, placeLikeRequest)
//   .delete(authenticateUser, authorizePicks, placeUnlikeRequest);

// router.get("/posts", authenticateUser, getLikesPostsList);
// router
//   .route("/posts/:id")
//   .post(authenticateUser, postLikeRequest)
//   .delete(authenticateUser, authorizeLikes, postUnlikeRequest);

export default router;
