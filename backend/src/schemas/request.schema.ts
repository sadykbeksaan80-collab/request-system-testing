import { z } from "zod";
import { RequestStatus } from "@prisma/client";

export const createRequestSchema = z.object({
  applicantName: z.string().trim().min(1, "Укажите имя заявителя"),
  email: z.string().trim().email("Укажите корректный email"),
  phone: z.string().trim().min(1, "Укажите телефон"),
  subject: z.string().trim().min(1, "Укажите тему заявки"),
  description: z.string().trim().min(1, "Укажите описание заявки")
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

export const updateRequestStatusSchema = z.object({
  status: z.nativeEnum(RequestStatus)
});

export type UpdateRequestStatusInput = z.infer<typeof updateRequestStatusSchema>;
