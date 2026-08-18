import type { RequestStatus } from "../types/request";

export const REQUEST_STATUSES: RequestStatus[] = ["NEW", "IN_PROGRESS", "COMPLETED", "REJECTED"];

const STATUS_LABELS: Record<RequestStatus, string> = {
  NEW: "Новая",
  IN_PROGRESS: "В работе",
  COMPLETED: "Выполнена",
  REJECTED: "Отклонена"
};

export function formatRequestStatus(status: RequestStatus): string {
  return STATUS_LABELS[status];
}

export function isRequestStatus(value: string): value is RequestStatus {
  return REQUEST_STATUSES.some((status) => status === value);
}
