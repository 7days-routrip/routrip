import JourneysController from "@/controller/journeys.ctl";
import { authenticateUser } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";

import express from "express";

const router = express.Router();
router.use(express.json());

router.get("/:id", authenticateUser, authorization, JourneysController.getJourneyDetail);
router.post("/", authenticateUser, JourneysController.addJourney);
router.put("/:id", authenticateUser, authorization, JourneysController.modifyJourney);
router.delete("/:id", authenticateUser, authorization, JourneysController.deleteJourney);

export default router;
