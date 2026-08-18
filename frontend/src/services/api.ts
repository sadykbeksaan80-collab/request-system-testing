import type { GetRequestsResponse, Request, RequestStatus } from "../types/request";

function getApiUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("Не задана переменная окружения VITE_API_URL");
  }

  return apiUrl.replace(/\/$/, "");
}

function isRequestStatus(value: unknown): value is RequestStatus {
  return value === "NEW" || value === "IN_PROGRESS" || value === "COMPLETED" || value === "REJECTED";
}

function isRequest(value: unknown): value is Request {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "number" &&
    typeof item.applicantName === "string" &&
    typeof item.email === "string" &&
    typeof item.phone === "string" &&
    typeof item.subject === "string" &&
    typeof item.description === "string" &&
    typeof item.createdAt === "string" &&
    isRequestStatus(item.status)
  );
}

function isGetRequestsResponse(value: unknown): value is GetRequestsResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;

  return body.success === true && Array.isArray(body.data) && body.data.every(isRequest);
}

export async function getRequests(): Promise<Request[]> {
  const response = await fetch(`${getApiUrl()}/requests`);

  if (!response.ok) {
    throw new Error("Не удалось загрузить заявки.");
  }

  const body: unknown = await response.json();

  if (!isGetRequestsResponse(body)) {
    throw new Error("Не удалось загрузить заявки.");
  }

  return body.data;
}
