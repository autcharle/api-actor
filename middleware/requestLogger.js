import { getCorrelationId } from "./correlationMiddleware.js";
import { logger } from "./logger.js";

export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const correlationId = getCorrelationId();

  req.context = {
    correlationId,
    startTime,
  };

  logger.info(`Request started ${req.url}`, {
    xCorrelationId: correlationId,
    method: req.method,
    path: req.path,
    query: req.query,
    headers: req.headers,
    body: req.body,
  });

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    let responseBody = res.responseBody;
    if (typeof responseBody === "string") {
      try {
        responseBody = JSON.parse(responseBody);
      } catch (error) {
        //
      }
    }
    logger.info(`Request ended - Response sent`, {
      xCorrelationId: correlationId,
      method: req.method,
      path: req.originalUrl,
      headers: res.headers,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      responseBody,
    });
  });

  next();
};
