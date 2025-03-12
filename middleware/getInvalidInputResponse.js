import { API_ERROR } from "../constants/error.js";
import { Error } from "../types/Error.js";
import { Response } from "../types/Response.js";

export const invalidInputResponse = (res, msg) => {
  return res.status(200).json(
    new Response({
      data: null,
      errors: [
        new Error({
          errorId: API_ERROR.INVALID_INPUT,
          message: msg,
        }),
      ],
    })
  );
};
