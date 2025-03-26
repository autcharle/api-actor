import express from "express";
import { StaffController } from "../controllers/staffController.js";

const router = express.Router();
const controller = new StaffController();
router.get("/", controller.getStaffByCredentials);
export default router;
