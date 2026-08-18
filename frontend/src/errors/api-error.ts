export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string>;

  constructor(status: number, fieldErrors: Record<string, string> = {}) {
    super("ApiError");
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}
