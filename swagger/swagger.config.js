const PORT = process.env.PORT || 3000;

export const swaggerConfig = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sakila API Documentation",
      version: "1.0.0",
      description: "API documentation for Film rental store management system",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
