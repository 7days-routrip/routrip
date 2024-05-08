import express, { Request, Response, NextFunction } from "express";
import usersController from "@/controller/users.ctl";
import { authenticateUser } from "@/middlewares/authentication";

const router = express.Router();

router.post("/join", usersController.join);
router.post("/login", usersController.login);
router.post("/check/email", usersController.checkEmail);
router.post("/check/nickname", usersController.checkNickname);

router.patch("/me", authenticateUser, usersController.patchUserInfoRequest);
router.route("/reset").post(usersController.resetRequest).patch(usersController.resetPasswordRequest);
router.patch("/me/reset", authenticateUser, usersController.userResetPassword);

export default router;
