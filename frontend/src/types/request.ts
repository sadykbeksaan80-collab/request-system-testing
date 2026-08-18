export type RequestStatus = "NEW" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";

export interface Request {
  id: number;
  applicantName: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
  createdAt: string;
  status: RequestStatus;
}

export interface GetRequestsResponse {
  success: boolean;
  data: Request[];
}
