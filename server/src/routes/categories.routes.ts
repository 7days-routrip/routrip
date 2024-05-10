import CategoriesController from "@/controller/categories.ctl";
import express from "express";
const router = express.Router();
router.use(express.json());

router.get("/", CategoriesController.categoryAllListRequest);

export default router;
