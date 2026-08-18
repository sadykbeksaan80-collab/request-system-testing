import type { NextFunction, Request, Response } from "express";
import { createRequestSchema } from "../schemas/request.schema.js";
import { requestService } from "../services/request.service.js";

class RequestController {
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
