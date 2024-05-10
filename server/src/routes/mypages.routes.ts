import { getUserListDataRequest } from "@/controller/mypages.ctl";
import express from "express";
const router = express.Router();
router.use(express.json());

router.route("/list").get(getUserListDataRequest);

export default router;
