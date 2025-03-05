import express from "express";
import db from "./utils/database.js";
import Actor from "./model/Actor.js";
import bodyParser from "body-parser";
import { Response } from "./types/Response.js";
import { Error } from "./types/Error.js";
import cors from "cors";

const server = express();

server.use(bodyParser.json());
server.use(cors());

server.get("/", async (req, res) => {
  const data = await db.execute("SELECT first_name, last_name FROM actor");
  res.json(data[0]);
});

server.get("/v1/actors", async (req, res) => {
  const data = await Actor.findAll();
  res.json(data);
});

server.get("/v1/actor/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const data = await Actor.findByPk(id);
  if (!data) {
    return res
      .status(404)
      .json({ errorId: "API-404", message: "Actor not found" });
  }
  res.json(data);
});

server.get("/v1/actors/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const data = await Actor.findByPk(id);
  if (!data) {
    return res.status(200).json(
      new Response({
        data: null,
        errors: [new Error({ errorId: "API-404", message: "Actor not found" })],
      })
    );
  }
  res.status(200).json(
    new Response({
      data,
      errors: null,
    })
  );
});

server.post("/v1/actors", async (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res.status(200).json(
      new Response({
        data: null,
        errors: [
          new Error({
            errorId: "API-400",
            message: "Missing first name or last name",
          }),
        ],
      })
    );
  }

  const data = await Actor.create({
    firstName: firstName,
    lastName: lastName,
    lastUpdate: Date.now(),
  });

  return res.status(201).json(new Response({ data, errors: null }));
});

server.delete("/v1/actors/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const data = await Actor.findByPk(id);

  if (data) {
    data.destroy();
    return res.status(200).json(new Response({ data, errors: null }));
  }

  return res.status(200).json(
    new Response({
      data: null,
      errors: [
        new Error({
          errorId: "API-404-1",
          message: "Actor not found to be deleted",
        }),
      ],
    })
  );
});

server.put("/v1/actors/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res.status(200).json(
      new Response({
        data: null,
        errors: [
          new Error({
            errorId: "API-400",
            message: "Missing first name or last name",
          }),
        ],
      })
    );
  }

  const data = await Actor.findByPk(id);

  if (!data) {
    return res.status(200).json(
      new Response({
        data: null,
        errors: [
          new Error({
            errorId: "API-404-2",
            message: "Actor not found to be updated",
          }),
        ],
      })
    );
  }

  data.firstName = firstName;
  data.lastName = lastName;
  data.lastUpdate = Date.now();
  data.save();

  return res.status(200).json(new Response({ data, errors: null }));
});

server.listen(5000, () => {
  console.log("Listening on port 5000");
});
