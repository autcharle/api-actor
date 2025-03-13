import joi from "joi";
import { ERROR } from "../constants/error.js";

export const filmSchema = {
  create: joi.object({
    title: joi.string().min(1).max(255).required().messages({
      "string.min": ERROR.FILM_TITLE_LETTER_MIN,
      "string.max": ERROR.FILM_TITLE_LETTER_MAX,
      "string.empty": ERROR.FILM_TITLE_REQUIRED,
    }),
    description: joi.string().max(65535).allow(null, ""),
    releaseYear: joi
      .number()
      .integer()
      .min(1900)
      .max(new Date().getFullYear())
      .allow(null),
    languageId: joi.number().integer().positive().required().messages({
      "number.base": ERROR.FILM_LANG_MUST_BE_NUM,
      "any.required": ERROR.FILM_LANG_REQUIRED,
    }),
    originalLanguageId: joi.number().integer().positive().allow(null),
    rentalDuration: joi.number().integer().min(1).default(3),
    rentalRate: joi.number().precision(2).min(0).default(4.99),
    length: joi.number().integer().min(1).allow(null),
    replacementCost: joi.number().precision(2).min(0).default(19.99),
    rating: joi.string().valid("G", "PG", "PG-13", "R", "NC-17").allow(null),
    specialFeatures: joi.string().allow(null, ""),
  }),

  update: joi
    .object({
      title: joi.string().min(1).max(255).messages({
        "string.min": ERROR.FILM_TITLE_LETTER_MIN,
        "string.max": ERROR.FILM_TITLE_LETTER_MAX,
      }),
      description: joi.string().max(65535).allow(null, ""),
      releaseYear: joi
        .number()
        .integer()
        .min(1900)
        .max(new Date().getFullYear())
        .allow(null),
      languageId: joi.number().integer().positive().messages({
        "number.base": ERROR.FILM_LANG_MUST_BE_NUM,
      }),
      originalLanguageId: joi.number().integer().positive().allow(null),
      rentalDuration: joi.number().integer().min(1),
      rentalRate: joi.number().precision(2).min(0),
      length: joi.number().integer().min(1).allow(null),
      replacementCost: joi.number().precision(2).min(0),
      rating: joi.string().valid("G", "PG", "PG-13", "R", "NC-17").allow(null),
      specialFeatures: joi.string().allow(null, ""),
    })
    .min(1), // Require at least one field to be present

  id: joi.object({
    id: joi.number().integer().positive().required().messages({
      "number.base": ERROR.PATH_PARAM_ID_MUST_BE_NUM,
      "number.integer": ERROR.PATH_PARAM_ID_MUST_BE_INT,
      "number.positive": ERROR.PATH_PARAM_ID_MUST_BE_POSITIVE,
      "any.required": ERROR.PATH_PARAM_ID_REQUIRED,
    }),
  }),
};
