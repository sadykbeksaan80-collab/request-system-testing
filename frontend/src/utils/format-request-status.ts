import type { RequestStatus } from "../types/request";

const STATUS_LABELS: Record<RequestStatus, string> = {
  NEW: "Новая",
  IN_PROGRESS: "В работе",
  COMPLETED: "Выполнена",
  REJECTED: "Отклонена"
};

export function formatRequestStatus(status: RequestStatus): string {
  return STATUS_LABELS[status];
}
