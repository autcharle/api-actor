import sequelize from "../utils/helper.js";
import initModels from "../models/init-models.js";
import { handleError } from "../middleware/handleError.js";
import { Response } from "../types/Response.js";
import { notFoundResponse } from "../middleware/getNotFoundResponse.js";
import { ERROR } from "../constants/error.js";
import { invalidInputResponse } from "../middleware/getInvalidInputResponse.js";

const models = initModels(sequelize);

export class FilmController {
  constructor() {
    this.getAllFilms = this.getAllFilms.bind(this);
    this.getFilmById = this.getFilmById.bind(this);
    this.createFilm = this.createFilm.bind(this);
    this.updateFilm = this.updateFilm.bind(this);
    this.validateFilmInput = this.validateFilmInput.bind(this);
  }

  async getAllFilms(req, res) {
    try {
      const data = await models.Film.findAll();
      return res.json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  async getFilmById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const data = await models.Film.findByPk(id);
      if (!data) {
        return notFoundResponse(res, ERROR.NOT_FOUND_FILM);
      }
      return res.json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  async createFilm(req, res) {
    try {
      const {
        title,
        description,
        releaseYear,
        languageId,
        originalLanguageId,
        rentalDuration,
        rentalRate,
        length,
        replacementCost,
        rating,
        specialFeatures,
      } = req.body;

      if (!this.validateFilmInput(req.body)) {
        return invalidInputResponse(res, ERROR.MISSING_REQUIRED_FIELDS);
      }
      const data = await models.Film.create({
        title,
        description,
        releaseYear,
        languageId,
        originalLanguageId,
        rentalDuration,
        rentalRate,
        length,
        replacementCost,
        rating,
        specialFeatures,
        lastUpdate: new Date(),
      });
      return res.status(201).json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  async deleteFilm(req, res) {
    try {
      const id = parseInt(req.params.id);
      const data = await models.Film.findByPk(id);

      if (!data) {
        return notFoundResponse(res, ERROR.DELETING_NOT_FOUND_FILM);
      }

      await data.destroy();
      return res.json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  async updateFilm(req, res) {
    try {
      const id = parseInt(req.params.id);

      if (!this.validateFilmInput(req.body)) {
        return invalidInputResponse(res, ERROR.MISSING_REQUIRED_FIELDS);
      }

      const film = await models.Film.findByPk(id);

      if (!film) {
        return notFoundResponse(res, ERROR.UPDATING_NOT_FOUND_FILM);
      }

      const updateData = {
        ...req.body,
        lastUpdate: new Date(),
      };

      const data = await film.update(updateData);
      return res.json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  validateFilmInput(input) {
    const requiredFields = ["title", "languageId"];
    return requiredFields.every(
      (field) => input[field] !== undefined && input[field] !== null
    );
  }
}
