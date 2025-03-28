import crypto from "crypto";

const SECRET_KEY = process.env.SERVER_SECRET;

// Function to generate dynamic secret key based on time, URL, and predefined key
export const generateSecretKey = (requestUrl, timestamp) => {
  console.log("timestamp ne: ", timestamp);
  const data = timestamp + requestUrl + SECRET_KEY; // Combine the timestamp, URL, and predefined secret key

  // Generate HMAC using SHA-256
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(data); // Add data to the HMAC
  return hmac.digest("hex"); // Return the generated hash as the secret key
};
