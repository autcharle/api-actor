import sequelize from "../utils/helper.js";
import initModels from "../models/init-models.js";
import { handleError } from "../middlewares/handleError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const models = initModels(sequelize);

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "National";

export class StaffController {
  constructor() {
    this.getStaffByCredentials = this.getStaffByCredentials.bind(this);
  }

  async getStaffByCredentials(req, res) {
    const { username, password } = req.body;
    try {
      const data = await models.Staff.findOne({ where: { username } });
      if (!data) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      bcrypt.compare(password, data.password, (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error comparing password" });
        }

        if (!result) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign(
          { userId: data.staffId, username: data.username }, // Payload
          JWT_SECRET_KEY, // Secret key
          { expiresIn: "3m" } // Token expiration (e.g., 1 hour)
        );

        // Successful login
        res.status(200).json({
          message: "Login successful",
          token: token, // Access token
          user: { username: data.username },
        });
      });
    } catch (error) {
      return handleError(res, error.message);
    }
  }
}
