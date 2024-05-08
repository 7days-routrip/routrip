import express from "express";

const router = express.Router();
router.use(express.json());

router.get("/:id");
router.get("/");
router.post("/");
router.put("/:id");
router.delete("/:id");

export default router;
