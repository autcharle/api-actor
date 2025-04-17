import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import filmRoutes from "./routes/filmRoutes.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { handleFailure } from "./middlewares/handleFailure.js";
import { correlationMiddleware } from "./middlewares/correlationMiddleware.js";
import { responseInterceptor } from "./middlewares/responseInterceptor.js";

const server = express();
const PORT = process.env.PORT_SERVER || 8080;

server.use(bodyParser.json());
server.use(cors());

server.use(responseInterceptor);
server.use(correlationMiddleware);
server.use(requestLogger);
server.use(handleFailure);

const FILM_URI = process.env.FILM_URI_SERVER || "/v1/films";
server.use(FILM_URI, filmRoutes);

server.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});
