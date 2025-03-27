import express from "express";
import { FilmController } from "../controllers/filmController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();
const controller = new FilmController();

/**
 * @swagger
 * components:
 *  schemas:
 *      Film:
 *          type: object
 *          required:
 *              - title
 *              - languageId
 *          properties:
 *              filmId:
 *                  type: integer
 *                  readOnly: true
 *                  minimum: 1
 *              title:
 *                  type: string
 *                  minLength: 1
 *                  maxLength: 255
 *              description:
 *                  type: string
 *                  nullable: true
 *              releaseYear:
 *                  type: integer
 *                  minimum: 1900
 *                  maximum: 2099
 *                  example: 2025
 *                  nullable: true
 *              languageId:
 *                  type: integer
 *                  minimum: 1
 *              originalLanguageId:
 *                  type: integer
 *                  minimum: 1
 *                  nullable: true
 *              rentalDuration:
 *                  type: integer
 *                  minimum: 1
 *                  default: 3
 *              rentalRate:
 *                  type: number
 *                  format: float
 *                  minimum: 0
 *                  default: 4.99
 *              length:
 *                  type: integer
 *                  minimum: 1
 *                  nullable: true
 *              replacementCost:
 *                  type: number
 *                  format: float
 *                  minimum: 0
 *                  default: 19.99
 *              rating:
 *                  type: string
 *                  enum: [G, PG, PG-13, R, NC-17]
 *                  nullable: true
 *              specialFeatures:
 *                  type: string
 *                  nullable: true
 *                  example: null
 *              lastUpdate:
 *                  type: string
 *                  format: date-time
 *                  readOnly: true
 */

/**
 * @swagger
 * /v1/films-bff:
 *  get:
 *      summary: Get all films
 *      tags: [Films]
 *      responses:
 *          200:
 *              description: Retrieve all films successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Film'
 *          500:
 *              description: Internal Server Error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */
router.get("/", authenticateToken, controller.getAllFilmsBff);

export default router;
