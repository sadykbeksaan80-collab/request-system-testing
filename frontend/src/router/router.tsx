import { createBrowserRouter, Navigate } from "react-router-dom";
import { NewRequestPage } from "../pages/NewRequestPage";
import { RequestDetailsPage } from "../pages/RequestDetailsPage";
import { RequestsPage } from "../pages/RequestsPage";

export const router = createBrowserRouter([
  {
    path: "/requests",
    element: <RequestsPage />
  },
  {
    path: "/requests/new",
    element: <NewRequestPage />
  },
  {
    path: "/requests/:id",
    element: <RequestDetailsPage />
  },
  {
    path: "*",
    element: <Navigate to="/requests" replace />
  }
]);
