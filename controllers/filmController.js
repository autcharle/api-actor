import sequelize from "../utils/helper.js";
import initModels from "../models/init-models.js";
import { handleError } from "../middlewares/handleError.js";
import { Response } from "../types/Response.js";
import { notFoundResponse } from "../middlewares/getNotFoundResponse.js";
import { ERROR } from "../constants/error.js";
import { invalidInputResponse } from "../middlewares/getInvalidInputResponse.js";
import { filmSchema } from "../schemas/filmSchema.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import axios from "axios";
import { generateSecretKey } from "../middlewares/generateSecretKey.js";

const models = initModels(sequelize);

export class FilmController {
  constructor() {
    this.getAllFilms = this.getAllFilms.bind(this);
    this.getFilmById = this.getFilmById.bind(this);
    this.createFilm = this.createFilm.bind(this);
    this.updateFilm = this.updateFilm.bind(this);
    this.deleteFilm = this.deleteFilm.bind(this);
  }

  validateRequest(schema, payload) {
    const { error } = schema.validate(payload, { abortEarly: false });
    if (error) {
      return {
        isValid: false,
        errors: error.details.map((detail) => detail.message),
      };
    } else {
      return {
        isValid: true,
        errors: null,
      };
    }
  }

  async getAllFilmsBff(req, res) {
    try {
      const requestUrl = process.env.FILM_URI_SERVER; // The URL to be requested on the server
      const timestamp = Date.now().toString(); // Get current timestamp
      const generatedSecretKey = generateSecretKey(requestUrl, timestamp); // Generate dynamic secret key
      console.log("client side token: ", generatedSecretKey);
      const response = await axios.get(
        `${process.env.SERVER_URL}${process.env.FILM_URI_SERVER}`,
        {
          headers: {
            "x-api-key": `${generatedSecretKey}`,
            timestamp,
          },
        }
      );
      return res.json(new Response(response.data));
    } catch (error) {
      return handleError(res, error.message);
    }
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
      const id = req.params.id;
      const validation = validateRequest(filmSchema.id, { id });
      if (!validation.isValid) {
        return invalidInputResponse(res, validation.errors);
      }
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
      const validation = validateRequest(filmSchema.create, req.body);

      if (!validation.isValid) {
        return invalidInputResponse(res, validation.errors);
      }

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
      const id = req.params.id;
      const validation = validateRequest(filmSchema.id, { id });
      if (!validation.isValid) {
        return invalidInputResponse(res, validation.errors);
      }
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
      const id = req.params.id;
      const idValidation = validateRequest(filmSchema.id, { id });
      if (!idValidation.isValid) {
        return invalidInputResponse(res, idValidation.errors);
      }

      const bodyValidation = validateRequest(filmSchema.update, req.body);
      if (!bodyValidation.isValid) {
        return invalidInputResponse(res, bodyValidation.errors);
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
}
