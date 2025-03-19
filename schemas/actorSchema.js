import joi from "joi";
import { ERROR } from "../constants/error.js";

export const actorSchema = {
  create: joi.object({
    firstName: joi
      .string()
      .min(2)
      .max(45)
      .pattern(/^[a-zA-Z\s-']+$/)
      .required()
      .messages({
        "string.pattern.base": ERROR.FIRST_NAME_PATTERN,
        "string.min": ERROR.FIRST_NAME_LETTER_MIN,
        "string.max": ERROR.FIRST_NAME_LETTER_MAX,
        "any.required": ERROR.FIRST_NAME_REQUIRED,
      }),
    lastName: joi
      .string()
      .min(2)
      .max(45)
      .pattern(/^[a-zA-Z\s-']+$/)
      .required()
      .messages({
        "string.pattern.base": ERROR.LAST_NAME_PATTERN,
        "string.min": ERROR.LAST_NAME_LETTER_MIN,
        "string.max": ERROR.LAST_NAME_LETTER_MAX,
        "any.required": ERROR.LAST_NAME_REQUIRED,
      }),
  }),

  update: joi.object({
    firstName: joi
      .string()
      .min(2)
      .max(45)
      .pattern(/^[a-zA-Z\s-']+$/)
      .required()
      .messages({
        "string.pattern.base": ERROR.FIRST_NAME_PATTERN,
        "string.min": ERROR.FIRST_NAME_LETTER_MIN,
        "string.max": ERROR.FIRST_NAME_LETTER_MAX,
        "any.required": ERROR.FIRST_NAME_REQUIRED,
      }),
    lastName: joi
      .string()
      .min(2)
      .max(45)
      .pattern(/^[a-zA-Z\s-']+$/)
      .required()
      .messages({
        "string.pattern.base": ERROR.LAST_NAME_PATTERN,
        "string.min": ERROR.LAST_NAME_LETTER_MIN,
        "string.max": ERROR.LAST_NAME_LETTER_MAX,
        "any.required": ERROR.LAST_NAME_REQUIRED,
      }),
  }),

  id: joi.object({
    id: joi.number().integer().positive().required().messages({
      "number.base": ERROR.PATH_PARAM_ID_MUST_BE_NUM,
      "number.integer": ERROR.PATH_PARAM_ID_MUST_BE_INT,
      "number.positive": ERROR.PATH_PARAM_ID_MUST_BE_POSITIVE,
      "any.required": ERROR.PATH_PARAM_ID_REQUIRED,
    }),
  }),
};
