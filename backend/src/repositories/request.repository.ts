import { prisma } from "../config/prisma.js";
import type { CreateRequestInput } from "../schemas/request.schema.js";

class RequestRepository {
  create(data: CreateRequestInput) {
    return prisma.request.create({ data });
  }

  findAll() {
    return prisma.request.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  findById(id: number) {
    return prisma.request.findUnique({
      where: { id }
    });
  }
}

export const requestRepository = new RequestRepository();
