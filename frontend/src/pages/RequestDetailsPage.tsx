import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "../errors/api-error";
import { getRequest, updateRequestStatus } from "../services/api";
import type { Request, RequestStatus } from "../types/request";
import { formatDate } from "../utils/format-date";
import { formatRequestStatus, isRequestStatus, REQUEST_STATUSES } from "../utils/format-request-status";
import { parseRequestId } from "../utils/parse-request-id";

export function RequestDetailsPage() {
  const { id: rawId } = useParams();
  const id = parseRequestId(rawId);

  const [request, setRequest] = useState<Request | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus>("NEW");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadRequest() {
      if (id === null) {
        setLoadError("Не удалось загрузить заявку.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getRequest(id);

        if (!cancelled) {
          setRequest(data);
          setSelectedStatus(data.status);
        }
      } catch (error) {
        if (!cancelled) {
          if (error instanceof ApiError && error.status === 404) {
            setLoadError("Заявка не найдена.");
          } else {
            setLoadError("Не удалось загрузить заявку.");
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadRequest();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleStatusSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (request === null || isUpdating || selectedStatus === request.status) {
      return;
    }

    setIsUpdating(true);
    setStatusError("");

    try {
      const updatedRequest = await updateRequestStatus(request.id, selectedStatus);
      setRequest(updatedRequest);
      setSelectedStatus(updatedRequest.status);
    } catch {
      setStatusError("Не удалось изменить статус.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">{request ? `Заявка #${request.id}` : "Заявка"}</h1>
        <div className="page__actions">
          <Link className="button-secondary" to="/requests">
            Назад к заявкам
          </Link>
          <Link className="button" to="/requests/new">
            Создать заявку
          </Link>
        </div>
      </header>

      {isLoading ? <p className="status-text">Загрузка заявки...</p> : null}

      {!isLoading && loadError !== "" ? (
        <p className="status-text status-text--error">{loadError}</p>
      ) : null}

      {!isLoading && request !== null ? (
        <>
          <dl className="details">
            <div className="details__row">
              <dt className="details__label">ID</dt>
              <dd className="details__value">#{request.id}</dd>
            </div>
            <div className="details__row">
              <dt className="details__label">ФИО</dt>
              <dd className="details__value">{request.applicantName}</dd>
            </div>
            <div className="details__row">
              <dt className="details__label">Email</dt>
              <dd className="details__value">{request.email}</dd>
            </div>
            <div className="details__row">
              <dt className="details__label">Телефон</dt>
              <dd className="details__value">{request.phone}</dd>
            </div>
            <div className="details__row">
              <dt className="details__label">Тема</dt>
              <dd className="details__value">{request.subject}</dd>
            </div>
            <div className="details__row">
              <dt className="details__label">Описание</dt>
              <dd className="details__value">{request.description}</dd>
            </div>
            <div className="details__row">
              <dt className="details__label">Дата создания</dt>
              <dd className="details__value">
                <time dateTime={request.createdAt}>{formatDate(request.createdAt)}</time>
              </dd>
            </div>
            <div className="details__row">
              <dt className="details__label">Статус</dt>
              <dd className="details__value">
                <span className={`status-badge status-badge--${request.status.toLowerCase()}`}>
                  {formatRequestStatus(request.status)}
                </span>
              </dd>
            </div>
          </dl>

          <form className="status-form" onSubmit={handleStatusSubmit}>
            <h2 className="status-form__title">Изменить статус</h2>
            <div className="form__field">
              <label className="form__label" htmlFor="status">
                Новый статус
              </label>
              <select
                id="status"
                className="form__select"
                value={selectedStatus}
                onChange={(event) => {
                  if (isRequestStatus(event.target.value)) {
                    setSelectedStatus(event.target.value);
                  }
                }}
                disabled={isUpdating}
              >
                {REQUEST_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {formatRequestStatus(status)}
                  </option>
                ))}
              </select>
            </div>
            {statusError ? <p className="status-text status-text--error">{statusError}</p> : null}
            <button className="button" type="submit" disabled={isUpdating || selectedStatus === request.status}>
              {isUpdating ? "Сохранение..." : "Сохранить статус"}
            </button>
          </form>
        </>
      ) : null}
    </main>
  );
}
