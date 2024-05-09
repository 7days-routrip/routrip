import { getCategoryListRequest } from "@/controller/categories.ctl";
import { getUserListDataRequest } from "@/controller/mypages.ctl";
import express from "express";
const router = express.Router();
router.use(express.json());

router.get("/", getCategoryListRequest);

export default router;
