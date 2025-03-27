import { generateSecretKey } from "./generateSecretKey.js";

// Middleware to authenticate based on dynamic secret key
export const authenticateSecretKey = (req, res, next) => {
  const TIMESTAMP_WINDOW = 1 * 60 * 1000;
  const requestUrl = req.originalUrl; // The requested URL
  const clientTimestamp = req.headers["timestamp"]; // Timestamp sent from the client
  const authHeader = req.headers["x-api-key"];

  if (!clientTimestamp || !authHeader) {
    return res.status(400).json({ error: "Missing required headers" });
  }

  const currentTime = Date.now(); // Current server time
  const timestampDifference = currentTime - clientTimestamp; // Difference between current time and client timestamp

  // Check if the timestamp is expired (older than 3 minutes)
  if (timestampDifference > TIMESTAMP_WINDOW) {
    return res
      .status(400)
      .json({ error: "Request expired. Timestamp is older than 3 minutes." });
  }

  const generatedSecretKey = generateSecretKey(requestUrl, clientTimestamp); // Generate dynamic secret key
  console.log("server side token: ", generatedSecretKey);

  // Compare the generated secret key with the one in the header
  if (authHeader !== `${generatedSecretKey}`) {
    return res
      .status(403)
      .json({ error: "Forbidden: Invalid or expired secret key" });
  }

  next(); // Proceed to the route handler if the key matches
};
