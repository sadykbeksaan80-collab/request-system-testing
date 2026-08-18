import { requestRepository } from "../repositories/request.repository.js";
import { AppError } from "../errors/app-error.js";
import type { CreateRequestInput } from "../schemas/request.schema.js";

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
}

export const requestService = new RequestService();
