import jwt from "jsonwebtoken";
import sequelize from "../utils/helper.js";
import initModels from "../models/init-models.js";
import { generateAccessToken } from "./generateAccessToken.js";

const models = initModels(sequelize);

// Middleware to verify the token
const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Assumes token is passed as "Bearer <token>"
  const refreshToken = req.header("x-refresh-token");

  if (!token || !refreshToken) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const user = jwt.verify(token, process.env.CLIENT_SECRET);
    // if (err) {
    //   return res.status(403).json({ message: "Invalid or expired token" });
    // }
    // Attach the user info to the request object
    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError" && refreshToken) {
      try {
        // verify refresh token from database
        const data = await models.Staff.findOne({
          where: { rfToken: refreshToken },
        });
        if (!data) {
          return res.status(401).json({ message: "Invalid refresh token" });
        }

        //verify refresh token (if expired)
        const decoded = jwt.verify(refreshToken, process.env.RF_SECRET);

        // generate new token
        const newAccessToken = generateAccessToken({
          userId: data.staffId,
          email: data.email,
        });

        res.setHeader("x-access-token", newAccessToken);

        req.user = decoded;
        return next();
      } catch (error) {
        return res.status(401).json({ message: error.message });
      }
    }

    return res.status(401).json({ message: "Invalid or expired token" });
  }
  // Verify the token
};

export default authenticateToken;
