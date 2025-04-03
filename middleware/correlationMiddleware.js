import { v4 as uuids4 } from "uuid";
import cls from "cls-hooked";
import { logger } from "./logger.js";

const namespace = cls.createNamespace("request-context");

export const correlationMiddleware = (req, res, next) => {
  namespace.run(() => {
    const correlationId = req.headers["x-correlation-id"] || uuids4();
    namespace.set("correlationId", correlationId);
    res.setHeader("x-correlation-id", correlationId);
    next();
  });
};

export const getCorrelationId = () => {
  if (namespace && namespace.active) {
    return namespace.get("correlationId");
  } else return undefined;
};
