import sequelize from "../utils/helper.js";
import initModels from "../models/init-models.js";
import { handleError } from "../middleware/handleError.js";
import { Response } from "../types/Response.js";
import { notFoundResponse } from "../middleware/getNotFoundResponse.js";
import { ERROR } from "../constants/error.js";
import { invalidInputResponse } from "../middleware/getInvalidInputResponse.js";

const models = initModels(sequelize);

export class FilmController {
  constructor() {
    this.getAllFilms = this.getAllFilms.bind(this);
    this.getFilmById = this.getFilmById.bind(this);
    this.createFilm = this.createFilm.bind(this);
    this.updateFilm = this.updateFilm.bind(this);
    this.validateFilmInput = this.validateFilmInput.bind(this);
  }
  /**
   * @swagger
   * /films:
   *   get:
   *     summary: Lấy danh sách tất cả các phim
   *     tags: [Films]
   *     responses:
   *       200:
   *         description: Thành công, trả về danh sách phim
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Film'
   */
  async getAllFilms(req, res) {
    try {
      const data = await models.Film.findAll();
      return res.json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  /**
   * @swagger
   * /films/{id}:
   *   get:
   *     summary: Lấy thông tin một bộ phim theo ID
   *     tags: [Films]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID của phim cần tìm
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Thành công, trả về thông tin phim
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Film'
   *       404:
   *         description: Không tìm thấy phim
   */

  async getFilmById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const data = await models.Film.findByPk(id);
      if (!data) {
        return notFoundResponse(res, ERROR.NOT_FOUND_FILM);
      }
      return res.json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  /**
   * @swagger
   * /films:
   *   post:
   *     summary: Thêm mới một bộ phim
   *     tags: [Films]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Film'
   *     responses:
   *       201:
   *         description: Thành công, phim đã được tạo
   *       400:
   *         description: Dữ liệu đầu vào không hợp lệ
   */

  async createFilm(req, res) {
    try {
      const {
        title,
        description,
        releaseYear,
        languageId,
        originalLanguageId,
        rentalDuration,
        rentalRate,
        length,
        replacementCost,
        rating,
        specialFeatures,
      } = req.body;

      if (!this.validateFilmInput(req.body)) {
        return invalidInputResponse(res, ERROR.MISSING_REQUIRED_FIELDS);
      }
      const data = await models.Film.create({
        title,
        description,
        releaseYear,
        languageId,
        originalLanguageId,
        rentalDuration,
        rentalRate,
        length,
        replacementCost,
        rating,
        specialFeatures,
        lastUpdate: new Date(),
      });
      return res.status(201).json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  /**
   * @swagger
   * /films/{id}:
   *   delete:
   *     summary: Xóa một bộ phim
   *     tags: [Films]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID của phim cần xóa
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Thành công, phim đã bị xóa
   *       404:
   *         description: Không tìm thấy phim
   */

  async deleteFilm(req, res) {
    try {
      const id = parseInt(req.params.id);
      const data = await models.Film.findByPk(id);

      if (!data) {
        return notFoundResponse(res, ERROR.DELETING_NOT_FOUND_FILM);
      }

      await data.destroy();
      return res.json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  /**
   * @swagger
   * /films/{id}:
   *   put:
   *     summary: Cập nhật thông tin một bộ phim
   *     tags: [Films]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID của phim cần cập nhật
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Film'
   *     responses:
   *       200:
   *         description: Thành công, phim đã được cập nhật
   *       404:
   *         description: Không tìm thấy phim
   */

  async updateFilm(req, res) {
    try {
      const id = parseInt(req.params.id);

      if (!this.validateFilmInput(req.body)) {
        return invalidInputResponse(res, ERROR.MISSING_REQUIRED_FIELDS);
      }

      const film = await models.Film.findByPk(id);

      if (!film) {
        return notFoundResponse(res, ERROR.UPDATING_NOT_FOUND_FILM);
      }

      const updateData = {
        ...req.body,
        lastUpdate: new Date(),
      };

      const data = await film.update(updateData);
      return res.json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }

  validateFilmInput(input) {
    const requiredFields = ["title", "languageId"];
    return requiredFields.every(
      (field) => input[field] !== undefined && input[field] !== null
    );
  }
}
