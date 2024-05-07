import express, { Request, Response, NextFunction } from "express";

const router = express.Router();
router.use(express.json());

export default router;
