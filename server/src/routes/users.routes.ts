import express, { Request, Response, NextFunction } from "express";
import usersController from "@/controller/users.ctl";

const router = express.Router();

router.post("/join", usersController.join);
router.post("/login", usersController.login);

router.post("/check/email", usersController.checkEmail);
router.post("/check/nickname", usersController.checkNickname);

export default router;
