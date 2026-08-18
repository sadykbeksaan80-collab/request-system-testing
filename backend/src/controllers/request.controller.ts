import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import { createRequestSchema } from "../schemas/request.schema.js";
import { requestService } from "../services/request.service.js";

class RequestController {
  async findById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(request.params.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        throw new AppError("Некорректный идентификатор заявки", 400);
      }

      const foundRequest = await requestService.findById(id);

      response.status(200).json({
        success: true,
        data: foundRequest
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(_request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const requests = await requestService.findAll();

      response.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const data = createRequestSchema.parse(request.body);
      const createdRequest = await requestService.create(data);

      response.status(201).json({
        success: true,
        data: createdRequest
      });
    } catch (error) {
      next(error);
    }
  }
}

export const requestController = new RequestController();
