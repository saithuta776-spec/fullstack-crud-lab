import express from "express";
import { check } from "../../middlewares/check.js";
import { healthControllers } from "../../controllers/healthController.js";
const router = express.Router();

router.get("/health", check, healthControllers);

export default router;
