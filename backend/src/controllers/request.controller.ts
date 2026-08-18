import type { NextFunction, Request, Response } from "express";
import { createRequestSchema, updateRequestStatusSchema } from "../schemas/request.schema.js";
import { requestService } from "../services/request.service.js";
import { parseRequestId } from "../utils/parse-request-id.js";

class RequestController {
  async updateStatus(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseRequestId(request.params.id);
      const { status } = updateRequestStatusSchema.parse(request.body);
      const updatedRequest = await requestService.updateStatus(id, status);

      response.status(200).json({
        success: true,
        data: updatedRequest
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseRequestId(request.params.id);
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
