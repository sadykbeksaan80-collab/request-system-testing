import { requestRepository } from "../repositories/request.repository.js";
import type { CreateRequestInput } from "../schemas/request.schema.js";

class RequestService {
  create(data: CreateRequestInput) {
    return requestRepository.create(data);
  }
}

export const requestService = new RequestService();
