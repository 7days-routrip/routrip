import express, { Request, Response, NextFunction } from "express";
import UsersController from "@/controller/users.ctl";
import { authenticateUser } from "@/middlewares/authentication";

const router = express.Router();

router.post("/join", UsersController.join);
router.post("/login", UsersController.login);
router.post("/check/email", UsersController.checkEmail);
router.post("/check/nickname", UsersController.checkNickname);
router.delete("/", authenticateUser, UsersController.userWithdraw);
router.post("/logout", authenticateUser, UsersController.logout);
router.patch("/me", authenticateUser, UsersController.userInfoUpdateRequest);
router.route("/reset").post(UsersController.resetRequest).patch(UsersController.resetPasswordRequest);
router.patch("/me/reset", authenticateUser, UsersController.userResetPassword);

export default router;
