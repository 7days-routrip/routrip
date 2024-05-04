import express, { Request, Response, NextFunction } from "express";
import usersController from "@/controller/users.controller";

const router = express.Router();

router.post("/join", usersController.join);

export default router;
