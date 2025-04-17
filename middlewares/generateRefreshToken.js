import jwt from "jsonwebtoken";

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.RF_SECRET, {
    expiresIn: "7d",
  });
