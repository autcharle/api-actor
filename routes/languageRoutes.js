import express from "express";
import { LanguageController } from "../controllers/languageController.js";

const router = express.Router();
const controller = new LanguageController();

router.get("/", controller.getAllLanguages);

export default router;
