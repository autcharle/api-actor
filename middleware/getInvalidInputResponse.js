import { API_ERROR } from "../constants/error.js";
import { Error } from "../types/Error.js";
import { Response } from "../types/Response.js";

export const invalidInputResponse = (res, msg) => {
  const errors = Array.isArray(msg)
    ? msg.map(
        (message) =>
          new Error({
            errorId: API_ERROR.INVALID_INPUT,
            message: message,
          })
      )
    : [new Error({ errorId: API_ERROR.INVALID_INPUT, message, msg })];
  return res.status(400).json(
    new Response({
      data: null,
      errors,
    })
  );
};
