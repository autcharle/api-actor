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

   /**
   * @swagger
   * /actors:
   *   get:
   *     summary: Lấy danh sách tất cả các diễn viên
   *     tags: [Actors]
   *     responses:
   *       200:
   *         description: Thành công, trả về danh sách diễn viên
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Actor'
   */

  async getAllActors(req, res) {
    try {
      const data = await models.Actor.findAll();
      return res.json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  /**
   * @swagger
   * /actors/{id}:
   *   get:
   *     summary: Lấy thông tin một diễn viên theo ID
   *     tags: [Actors]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID của diễn viên cần tìm
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Thành công, trả về thông tin diễn viên
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Actor'
   *       404:
   *         description: Không tìm thấy diễn viên
   */

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

   /**
   * @swagger
   * /actors:
   *   post:
   *     summary: Thêm mới một diễn viên
   *     tags: [Actors]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *                 example: "John"
   *               lastName:
   *                 type: string
   *                 example: "Doe"
   *     responses:
   *       201:
   *         description: Thành công, diễn viên đã được tạo
   *       400:
   *         description: Dữ liệu đầu vào không hợp lệ
   */

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

  /**
   * @swagger
   * /actors/{id}:
   *   delete:
   *     summary: Xóa một diễn viên
   *     tags: [Actors]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID của diễn viên cần xóa
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Thành công, diễn viên đã bị xóa
   *       404:
   *         description: Không tìm thấy diễn viên
   */

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

   /**
   * @swagger
   * /actors/{id}:
   *   put:
   *     summary: Cập nhật thông tin một diễn viên
   *     tags: [Actors]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID của diễn viên cần cập nhật
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *                 example: "John"
   *               lastName:
   *                 type: string
   *                 example: "Doe"
   *     responses:
   *       200:
   *         description: Thành công, diễn viên đã được cập nhật
   *       404:
   *         description: Không tìm thấy diễn viên
   */

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
