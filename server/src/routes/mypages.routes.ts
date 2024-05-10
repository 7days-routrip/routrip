import MypagesController from "@/controller/mypages.ctl";
import { authenticateUser } from "@/middlewares/authentication";
import express from "express";
const router = express.Router();
router.use(express.json());

router.get("/journeys", authenticateUser, MypagesController.getJourneysList);

export default router;
