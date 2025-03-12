import "dotenv/config";
import express from "express";
import db from "./utils/database.js";
import bodyParser from "body-parser";
import cors from "cors";
import actorRoutes from "./routes/actorRoutes.js";
import { Response } from "./types/Response.js";
import { Error } from "./types/Error.js";
import { API_ERROR, ERROR } from "./constants/error.js";

const server = express();

server.use(bodyParser.json());
server.use(cors());

server.get("/", async (req, res) => {
  const data = await db.execute("SELECT first_name, last_name FROM actor");
  res.json(data[0]);
});

const ACTOR_URI = process.env.ACTOR_URI || "/v1/actors";
server.use(ACTOR_URI, actorRoutes);

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
