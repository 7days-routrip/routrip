import { regNewPlace } from "@/controller/spots.ctl";
import express from "express";

const router = express.Router();
router.use(express.json());

// 신규 장소 등록
router.post("/", regNewPlace);

export default router;
