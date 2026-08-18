import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRequests } from "../services/api";
import type { Request } from "../types/request";
import { formatDate } from "../utils/format-date";
import { formatRequestStatus } from "../utils/format-request-status";
import "./RequestsPage.css";

export function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadRequests() {
      try {
        const data = await getRequests();

        if (!cancelled) {
          setRequests(data);
        }
      } catch {
        if (!cancelled) {
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadRequests();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="requests-page">
      <header className="requests-page__header">
        <h1 className="requests-page__title">Заявки</h1>
        <Link className="requests-page__create" to="/requests/new">
          Создать заявку
        </Link>
      </header>

      {isLoading ? <p className="requests-page__status">Загрузка заявок...</p> : null}

      {!isLoading && hasError ? (
        <p className="requests-page__status requests-page__status--error">Не удалось загрузить заявки.</p>
      ) : null}

      {!isLoading && !hasError && requests.length === 0 ? (
        <p className="requests-page__status">Заявок пока нет.</p>
      ) : null}

      {!isLoading && !hasError && requests.length > 0 ? (
        <ul className="requests-list">
          {requests.map((request) => (
            <li key={request.id}>
              <Link className="request-card" to={`/requests/${request.id}`}>
                <span className="request-card__id">#{request.id}</span>
                <span className="request-card__name">{request.applicantName}</span>
                <span className="request-card__subject">{request.subject}</span>
                <span className="request-card__meta">
                  <span>{formatRequestStatus(request.status)}</span>
                  <time dateTime={request.createdAt}>{formatDate(request.createdAt)}</time>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
