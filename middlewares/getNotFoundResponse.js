import { API_ERROR } from "../constants/error.js";
import { Error } from "../types/Error.js";
import { Response } from "../types/Response.js";

API_ERROR;

export const notFoundResponse = (res, msg) => {
  return res.status(404).json(
    new Response({
      data: null,
      errors: [
        new Error({
          errorId: API_ERROR.NOT_FOUND,
          message: msg,
        }),
      ],
    })
  );
};
