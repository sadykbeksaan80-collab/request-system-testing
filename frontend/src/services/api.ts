import { ApiError } from "../errors/api-error";
import type {
  CreateRequestPayload,
  CreateRequestResponse,
  GetRequestResponse,
  GetRequestsResponse,
  Request,
  RequestStatus,
  UpdateRequestStatusResponse
} from "../types/request";

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

function isRequestResponse(
  value: unknown
): value is GetRequestResponse | CreateRequestResponse | UpdateRequestStatusResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;

  return body.success === true && isRequest(body.data);
}

function extractFieldErrors(value: unknown): Record<string, string> {
  if (typeof value !== "object" || value === null || !("errors" in value)) {
    return {};
  }

  const errors = (value as { errors: unknown }).errors;

  if (typeof errors !== "object" || errors === null) {
    return {};
  }

  const fieldErrors: Record<string, string> = {};

  for (const [field, messages] of Object.entries(errors)) {
    if (Array.isArray(messages) && typeof messages[0] === "string" && messages[0] !== "") {
      fieldErrors[field] = messages[0];
    }
  }

  return fieldErrors;
}

async function fetchJson(path: string, init?: RequestInit): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(`${getApiUrl()}${path}`, init);
  } catch {
    throw new ApiError(0);
  }

  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new ApiError(response.status, extractFieldErrors(body));
  }

  return body;
}

export async function getRequests(): Promise<Request[]> {
  const body = await fetchJson("/requests");

  if (!isGetRequestsResponse(body)) {
    throw new ApiError(0);
  }

  return body.data;
}

export async function getRequest(id: number): Promise<Request> {
  const body = await fetchJson(`/requests/${id}`);

  if (!isRequestResponse(body)) {
    throw new ApiError(0);
  }

  return body.data;
}

export async function createRequest(data: CreateRequestPayload): Promise<Request> {
  const body = await fetchJson("/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!isRequestResponse(body)) {
    throw new ApiError(0);
  }

  return body.data;
}

export async function updateRequestStatus(id: number, status: RequestStatus): Promise<Request> {
  const body = await fetchJson(`/requests/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  if (!isRequestResponse(body)) {
    throw new ApiError(0);
  }

  return body.data;
}
