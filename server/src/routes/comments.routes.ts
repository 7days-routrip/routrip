import CommentsController from "@/controller/comments.ctl";
import { authenticateUser } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.post("/", authenticateUser, CommentsController.addComment);
router
  .route("/:id")
  .put(authenticateUser, authorization, CommentsController.updateComment)
  .delete(authenticateUser, authorization, CommentsController.deleteComment);

export default router;
