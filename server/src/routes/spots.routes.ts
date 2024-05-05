
import express, { Request, Response, NextFunction } from "express";
import { addToPlace, checkDuplicatePlaces, getPlaceDetail } from "@/controller/spots.ctl";

const router = express.Router();
router.use(express.json());

// 신규 장소 등록
router.post("/", addToPlace);
router.post("/check/:id", checkDuplicatePlaces);
router.get("/");
router.get("/:id", getPlaceDetail);

export default router;