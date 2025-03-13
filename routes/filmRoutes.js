import express from "express";
import { FilmController } from "../controllers/filmController.js";

const router = express.Router();
const controller = new FilmController();

/**
 * @swagger
 * components:
 *  schemas:
 *      Film:
 *          type: object
 *          required:
 *          - title
 *          properties:
 *              filmId:
 *                  type: integer
 *                  description: ID of the film
 *              title:
 *                  type: string
 *                  description: Title of the film
 *      FilmInput:
 *          type: object
 *          required:
 *              - title
 *          properties:
 *              title:
 *                  type: string
 *                  description: Title of the film
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
 *         
 */


/**
 * @swagger
 * /v1/films:
 *  get:
 *      summary: Returns a list of all films
 *      tags: [Films]
 *      responses:
 *          200:
 *              description: List of films
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Film'
 */
router.get("/", controller.getAllFilms);

/**
 * @swagger
 * /v1/films/{id}:
 *   get:
 *     summary: Get film by ID
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Film ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Film found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 *       404:
 *          description: Film not found
 *          content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */
router.get("/:id", controller.getFilmById);

/**
 * @swagger
 * /v1/films:
 *   post:
 *     summary: Create a new film
 *     tags: [Films]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Film'
 *     responses:
 *          201:
 *              description: Film created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Film'
 *          400:
 *              description: Invalid input
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */
router.post("/", controller.createFilm);

/**
 * @swagger
 * /v1/films/{id}:
 *   delete:
 *     summary: Delete a film
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Film ID
 *         schema:
 *           type: integer
 *     responses:
 *          200:
 *              description: Film deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Film'
 *          404:
 *              description: Film not found to be deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */
router.delete("/:id", controller.deleteFilm);

/**
 * @swagger
 * /v1/films/{id}:
 *   put:
 *     summary: Update a film
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Film ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Film'
 *     responses:
 *          200:
 *              description: Film updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Film'
 *          400:
 *              description: Invalid input
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *          404:
 *              description: Film not found to be updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */
router.put("/:id", controller.updateFilm);

export default router;
