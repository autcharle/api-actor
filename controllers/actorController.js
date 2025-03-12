import sequelize from "../utils/helper.js";
import initModels from "../models/init-models.js";
import { Response } from "../types/Response.js";
import { Error } from "../types/Error.js";
import { API_ERROR, ERROR } from "../constants/error.js";

const models = initModels(sequelize);

export class ActorController {
  constructor() {
    this.getAllActors = this.getAllActors.bind(this);
    this.getActorById = this.getActorById.bind(this);
    this.createActor = this.createActor.bind(this);
    this.deteleActor = this.deteleActor.bind(this);
    this.updateActor = this.updateActor.bind(this);
    this.handleError = this.handleError.bind(this);
    this.notFoundResponse = this.notFoundResponse.bind(this);
    this.invalidInputResponse = this.invalidInputResponse.bind(this);
  }

  async getAllActors(req, res) {
    try {
      const data = await models.Actor.findAll();
      return res.json(new Response({ data, errors: null }));
    } catch (error) {
      return this.handleError(res, error.message);
    }
  }

  async getActorById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const data = await models.Actor.findByPk(id);

      if (!data) {
        return this.notFoundResponses(res, ERROR.NOT_FOUND_ACTOR);
      }
      return res.status(200).json(new Response({ data, errors: null }));
    } catch (error) {
      return this.handleError(res, error.message);
    }
  }

  async createActor(req, res) {
    try {
      const { firstName, lastName } = req.body;
      if (!this.validateActorInputs(firstName, lastName)) {
        return this.invalidInputResponse(res, ERROR.MISSING_ACTOR_NAME);
      }

      const data = await models.Actor.create({
        firstName: firstName,
        lastName: lastName,
        lastUpdate: Date.now(),
      });

      return res.status(201).json(new Response({ data, errors: null }));
    } catch (error) {
      return this.handleError(res, error.message);
    }
  }

  async deteleActor(req, res) {
    try {
      const id = parseInt(req.params.id);
      const data = await models.Actor.findByPk(id);

      if (data) {
        data.destroy();
        return res.status(200).json(new Response({ data, errors: null }));
      }

      return this.notFoundResponse(res, ERROR.DELETING_NOT_FOUND_ACTOR);
    } catch (error) {
      return this.handleError(res, error.message);
    }
  }

  async updateActor(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { firstName, lastName } = req.body;

      if (!this.validateActorInputs(firstName, lastName)) {
        return this.invalidInputResponse(res, ERROR.MISSING_ACTOR_NAME);
      }

      const data = await models.Actor.findByPk(id);

      if (!data) {
        return this.notFoundResponse(res, ERROR.UPDATING_NOT_FOUND_ACTOR);
      }

      data.firstName = firstName;
      data.lastName = lastName;
      data.lastUpdate = Date.now();
      data.save();

      return res.status(200).json(new Response({ data, errors: null }));
    } catch (error) {
      return this.handleError(res, error.message);
    }
  }

  // Helper methods
  validateActorInputs(firstName, lastName) {
    return firstName && lastName;
  }

  invalidInputResponse(res, msg) {
    return res.status(200).json(
      new Response({
        data: null,
        errors: [
          new Error({
            errorId: API_ERROR.INVALID_INPUT,
            message: msg,
          }),
        ],
      })
    );
  }

  handleError(res, msg) {
    return res.status(500).json(
      new Response({
        data: null,
        errors: [
          new Error({
            errorId: API_ERROR.INTERNAL_SERVER_ERROR,
            message: msg,
          }),
        ],
      })
    );
  }

  notFoundResponse(res, msg) {
    return res.status(200).json(
      new Response({
        data: null,
        errors: [
          new Error({
            errorId: API_ERROR.NOT_FOUND,
            message: msg,
          }),
        ],
      })
    );
  }
}
