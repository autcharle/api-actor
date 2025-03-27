import jwt from "jsonwebtoken";

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.RF_JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
