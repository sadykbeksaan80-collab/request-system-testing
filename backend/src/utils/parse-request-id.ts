import { AppError } from "../errors/app-error.js";

export function parseRequestId(value: string | string[] | undefined): number {
  if (typeof value !== "string") {
    throw new AppError("Некорректный идентификатор заявки", 400);
  }

  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new AppError("Некорректный идентификатор заявки", 400);
  }

  return id;
}
