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
 *              actorId:
 *                  type: integer
 *                  minimum: 1
 *                  readOnly: true
 *                  description: Auto-generated ID of the actor
 *              firstName:
 *                  type: string
 *                  description: First name of the actor
 *              lastName:
 *                  type: string
 *                  description: Last name of the actor
 *              lastUpdate:
 *                  type: string
 *                  format: date-time
 *                  readOnly: true
 *      ActorInput:
 *          type: object
 *          required:
 *              - firstName
 *              - lastName
 *          properties:
 *              firstName:
 *                  type: string
 *                  description: First name of the actor
 *              lastName:
 *                  type: string
 *                  description: Last name of the actor
 *      Error:
 *          type: object
 *          required:
 *              - errorId
 *              - message
 *          properties:
 *              errorId:
 *                  type: string
 *                  description: Error code of errors
 *              message:
 *                  type: string
 *                  description: Error message of errors
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

/**
 * @swagger
 * /v1/actors/{id}:
 *  get:
 *      summary: Get actor by ID
 *      tags: [Actors]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Actor ID
 *      responses:
 *          200:
 *              description: Actor found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Actor'
 *          404:
 *              description: Actor not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */
router.get("/:id", controller.getActorById);

/**
 * @swagger
 * /v1/actors:
 *  post:
 *      summary: Create a new actor
 *      tags: [Actors]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/ActorInput'
 *      responses:
 *          201:
 *              description: Actor created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Actor'
 *          400:
 *              description: Invalid input
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */
router.post("/", controller.createActor);

/**
 * @swagger
 * /v1/actors/{id}:
 *  delete:
 *      summary: Delete an actor
 *      tags: [Actors]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Actor ID
 *      responses:
 *          200:
 *              description: Actor deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Actor'
 *          404:
 *              description: Actor not found to be deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */
router.delete("/:id", controller.deleteActor);

/**
 * @swagger
 * /v1/actors/{id}:
 *  put:
 *      summary: Update an actor
 *      tags: [Actors]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Actor ID
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/ActorInput'
 *      responses:
 *          200:
 *              description: Actor updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Actor'
 *          400:
 *              description: Invalid input
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *          404:
 *              description: Actor not found to be updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */
router.put("/:id", controller.updateActor);

export default router;
