import sequelize from "../utils/helper.js";
import initModels from "../models/init-models.js";
import { Response } from "../types/Response.js";
import { ERROR } from "../constants/error.js";
import { handleError } from "../middleware/handleError.js";
import { notFoundResponse } from "../middleware/getNotFoundResponse.js";
import { invalidInputResponse } from "../middleware/getInvalidInputResponse.js";

const models = initModels(sequelize);

export class ActorController {
  constructor() {
    this.getAllActors = this.getAllActors.bind(this);
    this.getActorById = this.getActorById.bind(this);
    this.createActor = this.createActor.bind(this);
    this.deleteActor = this.deleteActor.bind(this);
    this.updateActor = this.updateActor.bind(this);
    this.validateActorInputs = this.validateActorInputs.bind(this);
  }

  async getAllActors(req, res) {
    try {
      const data = await models.Actor.findAll();
      return res.json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  async getActorById(req, res) {
    try {
      const id = parseInt(req.params.id);
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
      const { firstName, lastName } = req.body;
      if (!this.validateActorInputs(firstName, lastName)) {
        return invalidInputResponse(res, ERROR.MISSING_ACTOR_NAME);
      }

      const data = await models.Actor.create({
        firstName: firstName,
        lastName: lastName,
        lastUpdate: Date.now(),
      });

      return res.status(201).json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  async deleteActor(req, res) {
    try {
      const id = parseInt(req.params.id);
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
      const id = parseInt(req.params.id);
      const { firstName, lastName } = req.body;

      if (!this.validateActorInputs(firstName, lastName)) {
        return invalidInputResponse(res, ERROR.MISSING_ACTOR_NAME);
      }

      const actor = await models.Actor.findByPk(id);

      if (!actor) {
        return notFoundResponse(res, ERROR.UPDATING_NOT_FOUND_ACTOR);
      }

      const updateData = { ...req.body, lastUpdate: new Date() };
      const data = await actor.update(updateData);

      return res.status(200).json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  // Client validation methods
  validateActorInputs(firstName, lastName) {
    return firstName && lastName;
  }
}
