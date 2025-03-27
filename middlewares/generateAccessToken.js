import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) =>
  jwt.sign(
    payload, // Payload
    process.env.JWT_SECRET_KEY, // Secret key
    { expiresIn: "5m" } // Token expiration (e.g., 1 hour)
  );
