import type { CreateRequestPayload } from "../types/request";

export type CreateRequestFieldErrors = Partial<Record<keyof CreateRequestPayload, string>>;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateCreateRequest(values: CreateRequestPayload): CreateRequestFieldErrors {
  const errors: CreateRequestFieldErrors = {};

  if (values.applicantName.trim() === "") {
    errors.applicantName = "Укажите ФИО";
  }

  if (values.email.trim() === "") {
    errors.email = "Укажите email";
  } else if (!isValidEmail(values.email.trim())) {
    errors.email = "Укажите корректный email";
  }

  if (values.phone.trim() === "") {
    errors.phone = "Укажите телефон";
  }

  if (values.subject.trim() === "") {
    errors.subject = "Укажите тему";
  }

  if (values.description.trim() === "") {
    errors.description = "Укажите описание";
  }

  return errors;
}
