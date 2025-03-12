import express from "express";
import { ActorController } from "../controllers/actorController.js";

const router = express.Router();
const actorController = new ActorController();

router.get("/", actorController.getAllActors);
router.get("/:id", actorController.getActorById);
router.post("/", actorController.createActor);
router.delete("/:id", actorController.deteleActor);
router.put(":/id", actorController.updateActor);

export default router;
