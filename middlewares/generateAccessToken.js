import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) =>
  jwt.sign(
    payload, // Payload
    process.env.CLIENT_SECRET, // Secret key
    { expiresIn: "5m" } // Token expiration (e.g., 1 hour)
  );
