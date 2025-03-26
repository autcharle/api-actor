import { API_ERROR } from "../constants/error.js";
import { Response } from "../types/Response.js";
import { Error } from "../types/Error.js";

export const handleError = (res, msg) => {
  return res.status(500).json(
    new Response({
      data: null,
      errors: [
        new Error({
          errorId: API_ERROR.INTERNAL_SERVER_ERROR,
          message: msg,
        }),
      ],
    })
  );
};
