import express from "express";
import db from "./utils/database.js";
import bodyParser from "body-parser";
import cors from "cors";
import actorRoutes from "./routes/actorRoutes.js";
import filmRoutes from "./routes/filmRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "yamljs";
import { requestLogger } from "./middlewares/requestLogger.js";
import { handleFailure } from "./middlewares/handleFailure.js";
import { correlationMiddleware } from "./middlewares/correlationMiddleware.js";
import { responseInterceptor } from "./middlewares/responseInterceptor.js";

const server = express();
const PORT = process.env.PORT || 3000;

const swaggerDocs = yaml.parse(
  fs.readFileSync("./api/api-actor.swagger.yaml", "utf8")
);

server.use(bodyParser.json());
server.use(cors());
if (process.env.NODE_ENV === "development") {
  server.use("/v1/swagger-api", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

server.use(responseInterceptor);
server.use(correlationMiddleware);
server.use(requestLogger);
server.use(handleFailure);

server.get("/", async (req, res) => {
  const data = await db.execute("SELECT first_name, last_name FROM actor");
  res.json(data[0]);
});

const ACTOR_URI = process.env.ACTOR_URI || "/v1/actors";
const FILM_URI = process.env.FILM_URI || "/v1/films";
const STAFF_URI = process.env.STAFF_URI || "/v1/auth/token";
server.use(ACTOR_URI, actorRoutes);
server.use(FILM_URI, filmRoutes);
server.use(STAFF_URI, staffRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger API documentation available at /v1/swagger-api`);
});
