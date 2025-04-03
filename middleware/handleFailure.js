import { Response } from "../types/Response.js";
import { Error } from "../types/Error.js";
import { ERROR, API_ERROR } from "../constants/error.js";
import { logger } from "./logger.js";
import { getCorrelationId } from "./correlationMiddleware.js";

export const handleFailure = (err, req, res, next) => {
  logger.error("Unhandled error", {
    xCorrelationId: getCorrelationId(),
    error: {
      message: err.message,
      stack: err.stack,
    },
    request: {
      method: req.method,
      path: req.path,
      headers: req.headers,
    },
  });
  res.status(500).json(
    new Response({
      data: null,
      errors: [
        new Error({
          errorId: API_ERROR.INTERNAL_SERVER_ERROR,
          message: ERROR.INTERNAL_SERVER_ERROR,
        }),
      ],
    })
  );
};
