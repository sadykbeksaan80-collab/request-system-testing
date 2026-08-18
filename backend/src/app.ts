import express from "express";
import { errorHandler } from "./middleware/error.middleware.js";
import requestRouter from "./routes/request.routes.js";

const app = express();

app.use(express.json());

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  next();
});

app.get("/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Server is running"
  });
});

app.use("/api/requests", requestRouter);

app.use(errorHandler);

export default app;
