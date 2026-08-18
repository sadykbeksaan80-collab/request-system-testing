import { requestRepository } from "../repositories/request.repository.js";
import { AppError } from "../errors/app-error.js";
import type { CreateRequestInput } from "../schemas/request.schema.js";
import type { RequestStatus } from "@prisma/client";

class RequestService {
  create(data: CreateRequestInput) {
    return requestRepository.create(data);
  }

  findAll() {
    return requestRepository.findAll();
  }

  async findById(id: number) {
    const request = await requestRepository.findById(id);

    if (!request) {
      throw new AppError("Заявка не найдена", 404);
    }

    return request;
  }

  async updateStatus(id: number, status: RequestStatus) {
    const request = await requestRepository.findById(id);

    if (!request) {
      throw new AppError("Заявка не найдена", 404);
    }

    return requestRepository.updateStatus(id, status);
  }
}

export const requestService = new RequestService();
