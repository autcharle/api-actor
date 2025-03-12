import express from "express";
import { ActorController } from "../controllers/actorController.js";

const router = express.Router();
// const actorController = new ActorController();

router.get("/", ActorController.getAllActors.bind(ActorController));
router.get("/:id", ActorController.getActorById.bind(ActorController));
router.post("/", ActorController.createActor.bind(ActorController));
router.delete("/:id", ActorController.deteleActor.bind(ActorController));
router.put(":/id", ActorController.updateActor.bind(ActorController));

export default router;
