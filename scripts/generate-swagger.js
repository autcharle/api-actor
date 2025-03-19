import { swaggerConfig } from "../swagger/swagger.config.js";
import fs from "fs";
import yaml from "yamljs";
import swaggerJsdoc from "swagger-jsdoc";

// Generate swagger specification
const specs = swaggerJsdoc(swaggerConfig);

// Convert to YAML
const swaggerSpec = yaml.stringify(specs);

// Create docs directory if it doesn't exist
if (!fs.existsSync("./api")) {
  fs.mkdirSync("./api");
}

// Write to file
fs.writeFileSync("./api/api-actor.swagger.yaml", swaggerSpec);

console.log("Swagger API documentation generated successfully at /api");
