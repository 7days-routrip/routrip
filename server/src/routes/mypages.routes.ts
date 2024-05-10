import MypagesController from "@/controller/mypages.ctl";
import { authenticateUser } from "@/middlewares/authentication";
import express from "express";
const router = express.Router();
router.use(express.json());

router.get("/comments", authenticateUser, MypagesController.commentUserAllList);
router.get("/posts", authenticateUser, MypagesController.postUserAllList);
router.get("/journeys", authenticateUser, MypagesController.getJourneysList);
router.get("/total-data-quantity", authenticateUser, MypagesController.userTotalData);

export default router;
