import JourneysController from "@/controller/journeys.ctl";
import { authenticateUser } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import express from "express";

const router = express.Router();
router.use(express.json());

router.get("/:id", authenticateUser, authorization, JourneysController.getJourneyDetail);
router.post("/");
router.put("/:id");
router.delete("/:id");

export default router;
