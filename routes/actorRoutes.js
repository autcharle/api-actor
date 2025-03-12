import express from "express";
import { ActorController } from "../controllers/actorController.js";

const router = express.Router();
const controller = new ActorController();

/**
 * @swagger
 * components:
 *  schemas:
 *      Actor:
 *          type: object
 *          required:
 *              - firstName
 *              - lastName
 *          properties:
 *              id:
 *                  type: string
 *                  description: Auto-generated ID of the actor
 *              firstName:
 *                  type: string
 *                  description: First name of the actor
 *              lastName:
 *                  type: string
 *                  description: Last name of the actor
 */

/**
 * @swagger
 * /v1/actors:
 *   get:
 *      summary: Returns a list of all actors
 *      tags: [Actors]
 *      responses:
 *          200:
 *              description: List of actors
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Actor'
 */
router.get("/", controller.getAllActors);
router.get("/:id", controller.getActorById);
router.post("/", controller.createActor);
router.delete("/:id", controller.deteleActor);
router.put("/:id", controller.updateActor);

export default router;
