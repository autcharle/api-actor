import "dotenv/config";
import express from "express";
import db from "./utils/database.js";
import bodyParser from "body-parser";
import cors from "cors";
import actorRoutes from "./routes/actorRoutes.js";
import filmRoutes from "./routes/filmRoutes.js";
import { Response } from "./types/Response.js";
import { Error } from "./types/Error.js";
import { API_ERROR, ERROR } from "./constants/error.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const server = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Actor API Documentation",
      version: "1.0.0",
      description: "API documentation for Actor management system",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

server.use(bodyParser.json());
server.use(cors());
server.use("/v1/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
