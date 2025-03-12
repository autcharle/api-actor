import express from "express";
import { FilmController } from "../controllers/filmController.js";

const router = express.Router();
const controller = new FilmController();

router.get("/", controller.getAllFilms);
router.get("/:id", controller.getFilmById);
router.post("/", controller.createFilm);
router.delete("/:id", controller.deleteFilm);
router.put("/:id", controller.updateFilm);

export default router;
