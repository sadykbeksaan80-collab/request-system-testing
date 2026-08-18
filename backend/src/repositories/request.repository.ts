import { prisma } from "../config/prisma.js";
import type { CreateRequestInput } from "../schemas/request.schema.js";

class RequestRepository {
  create(data: CreateRequestInput) {
    return prisma.request.create({ data });
  }
}

export const requestRepository = new RequestRepository();
