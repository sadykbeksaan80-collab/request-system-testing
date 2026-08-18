import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      message: error.message
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      success: false,
      message: "Ошибка валидации",
      errors: error.flatten().fieldErrors
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    success: false,
    message: "Внутренняя ошибка сервера"
  });
};
