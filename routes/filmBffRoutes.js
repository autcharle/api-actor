import express from "express";
import { FilmController } from "../controllers/filmController.js";

const router = express.Router();
const controller = new FilmController();

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
router.get("/", controller.getAllFilmsBff);

export default router;
