import CommentsController from "@/controller/comments.ctl";
import { authenticateUser } from "@/middlewares/authentication";
import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.post('/', authenticateUser, CommentsController.addComment);

export default router;
