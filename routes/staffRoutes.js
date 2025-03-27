import express from "express";
import { StaffController } from "../controllers/staffController.js";

const router = express.Router();
const controller = new StaffController();
router.post("/", controller.getCredentialsByStaff);
export default router;
