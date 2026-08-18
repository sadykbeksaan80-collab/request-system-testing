import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Server is running"
  });
});

export default app;
