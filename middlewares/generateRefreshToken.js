import jwt from "jsonwebtoken";

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.CLIENT_SECRET, {
    expiresIn: "7d",
  });
