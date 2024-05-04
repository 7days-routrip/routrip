import express, { Request, Response, NextFunction } from "express";
import { Repository } from "typeorm";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "@/config/ormSetting";
import { Places } from "@/models/places.model";
import { regNewPlace } from "@/controller/spots.ctl";

const router = express.Router();
router.use(express.json());

// 신규 장소 등록
router.post("/", regNewPlace);

export default router;