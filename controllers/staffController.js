import sequelize from "../utils/helper.js";
import initModels from "../models/init-models.js";
import { handleError } from "../middlewares/handleError.js";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../middlewares/generateAccessToken.js";
import { generateRefreshToken } from "../middlewares/generateRefreshToken.js";

const models = initModels(sequelize);

export class StaffController {
  constructor() {
    this.getCredentialsByStaff = this.getCredentialsByStaff.bind(this);
  }

  async getCredentialsByStaff(req, res) {
    const { email, password } = req.body;
    try {
      const data = await models.Staff.findOne({ where: { email } });
      if (!data) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      // const hashedPassword = bcrypt.hashSync(password, 10);
      // console.log("pass ne: ", hashedPassword);
      bcrypt.compare(password, data.password, async (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error comparing password" });
        }

        if (!result) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const acToken = generateAccessToken({
          userId: data.staffId,
          email: data.email,
        });

        console.log("access token ne: ", acToken);

        const rfToken = generateRefreshToken({
          userId: data.staffId,
          email: data.email,
        });

        console.log("refresh token ne: ", rfToken);

        await data.update({ rfToken: rfToken, lastUpdate: new Date() });

        // Successful login
        return res.status(200).json({
          token_type: "Bearer",
          access_token: acToken, // Access token
          expires_in: 300,
          refresh_token: rfToken, // Refresh token
        });
      });
    } catch (error) {
      return handleError(res, error.message);
    }
  }
}
