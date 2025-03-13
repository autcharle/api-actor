import sequelize from "../utils/helper.js";
import initModels from "../models/init-models.js";
import { handleError } from "../middleware/handleError.js";
import { Response } from "../types/Response.js";

const models = initModels(sequelize);

export class LanguageController {
  constructor() {
    this.getAllLanguage = this.getAllLanguages.bind(this);
  }

  async getAllLanguages(req, res) {
    try {
      const data = await models.Language.findAll();
      return res.json(new Response({ data, errors: null }));
    } catch (error) {
      return handleError(res, error.message);
    }
  }
}
