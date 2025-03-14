import express from "express";
import db from "./utils/database.js";
import bodyParser from "body-parser";
import cors from "cors";
import actorRoutes from "./routes/actorRoutes.js";
import filmRoutes from "./routes/filmRoutes.js";
import { Response } from "./types/Response.js";
import { Error } from "./types/Error.js";
import { API_ERROR, ERROR } from "./constants/error.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "yamljs";

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

server.get("/", async (req, res) => {
  const data = await db.execute("SELECT first_name, last_name FROM actor");
  res.json(data[0]);
});

const ACTOR_URI = process.env.ACTOR_URI || "/v1/actors";
const FILM_URI = process.env.FILM_URI || "/v1/films";
server.use(ACTOR_URI, actorRoutes);
server.use(FILM_URI, filmRoutes);

// Error handling middleware
server.use((err, res, req, next) => {
  console.log(err.stack);
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
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger API documentation available at /v1/swagger-api`);
});
