import express from "express";
import { ActorController } from "../controllers/actorController.js";

const router = express.Router();
const controller = new ActorController();

router.get("/", controller.getAllActors);
router.get("/:id", controller.getActorById);
router.post("/", controller.createActor);
router.delete("/:id", controller.deteleActor);
router.put("/:id", controller.updateActor);

export default router;
