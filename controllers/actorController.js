import sequelize from "../utils/helper.js";
import initModels from "../models/init-models.js";
import { Response } from "../types/Response.js";
import { ERROR } from "../constants/error.js";
import { handleError } from "../middlewares/handleError.js";
import { notFoundResponse } from "../middlewares/getNotFoundResponse.js";
import { invalidInputResponse } from "../middlewares/getInvalidInputResponse.js";
import { actorSchema } from "../schemas/actorSchema.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const models = initModels(sequelize);

export class ActorController {
  constructor() {
    this.getAllActors = this.getAllActors.bind(this);
    this.getActorById = this.getActorById.bind(this);
    this.createActor = this.createActor.bind(this);
    this.deleteActor = this.deleteActor.bind(this);
    this.updateActor = this.updateActor.bind(this);
  }

  async getAllActors(req, res) {
    try {
      console.log("📡 Received GET /v1/actors");
      const data = await models.Actor.findAll();
      return res.json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  async getActorById(req, res) {
    try {
      const id = req.params.id;
      const validation = validateRequest(actorSchema.id, {
        id,
      });
      if (!validation.isValid) {
        return invalidInputResponse(res, validation.errors);
      }

      const data = await models.Actor.findByPk(id);

      if (!data) {
        return notFoundResponse(res, ERROR.NOT_FOUND_ACTOR);
      }
      return res.status(200).json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  async createActor(req, res) {
    try {
      const validation = validateRequest(actorSchema.create, req.body);
      if (!validation.isValid) {
        return invalidInputResponse(res, validation.errors);
      }

      const { firstName, lastName } = req.body;
      const data = await models.Actor.create({
        firstName: firstName,
        lastName: lastName,
        lastUpdate: Date.now(),
      });

      console.log("Emitting new-actor event:", data);
      req.io.emit("new-actor", data);

      return res.status(201).json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  async deleteActor(req, res) {
    try {
      const id = req.params.id;
      const validation = validateRequest(actorSchema.id, {
        id,
      });
      if (!validation.isValid) {
        return invalidInputResponse(res, validation.errors);
      }
      const data = await models.Actor.findByPk(id);

      if (data) {
        data.destroy();
        return res.status(200).json(new Response({ data, errors: null }));
      }

      return notFoundResponse(res, ERROR.DELETING_NOT_FOUND_ACTOR);
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  async updateActor(req, res) {
    try {
      const id = req.params.id;
      const idValidation = validateRequest(actorSchema.id, {
        id,
      });
      if (!idValidation.isValid) {
        return invalidInputResponse(res, idValidation.errors);
      }

      const actor = await models.Actor.findByPk(id);

      if (!actor) {
        return notFoundResponse(res, ERROR.UPDATING_NOT_FOUND_ACTOR);
      }

      const bodyValidation = validateRequest(actorSchema.update, req.body);
      if (!bodyValidation.isValid) {
        return invalidInputResponse(res, bodyValidation.errors);
      }

      const updateData = { ...req.body, lastUpdate: new Date() };
      const data = await actor.update(updateData);

      return res.status(200).json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }
}
