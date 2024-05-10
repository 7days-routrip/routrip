import categoriesController from "@/controller/categories.ctl";
import express from "express";
const router = express.Router();
router.use(express.json());

router.get("/", categoriesController.categoryAllListRequest);

export default router;
