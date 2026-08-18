import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../errors/api-error";
import { createRequest } from "../services/api";
import type { CreateRequestPayload } from "../types/request";
import { validateCreateRequest, type CreateRequestFieldErrors } from "../utils/validate-create-request";

const emptyForm: CreateRequestPayload = {
  applicantName: "",
  email: "",
  phone: "",
  subject: "",
  description: ""
};

export function NewRequestPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<CreateRequestPayload>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<CreateRequestFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof CreateRequestPayload>(field: K, value: CreateRequestPayload[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextErrors = validateCreateRequest(values);
    setFieldErrors(nextErrors);
    setFormError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const createdRequest = await createRequest({
        applicantName: values.applicantName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        subject: values.subject.trim(),
        description: values.description.trim()
      });

      navigate(`/requests/${createdRequest.id}`);
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fieldErrors).length > 0) {
        setFieldErrors({
          applicantName: error.fieldErrors.applicantName,
          email: error.fieldErrors.email,
          phone: error.fieldErrors.phone,
          subject: error.fieldErrors.subject,
          description: error.fieldErrors.description
        });
      }

      setFormError("Не удалось создать заявку.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">Новая заявка</h1>
        <div className="page__actions">
          <Link className="button-secondary" to="/requests">
            Назад к заявкам
          </Link>
        </div>
      </header>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__field">
          <label className="form__label" htmlFor="applicantName">
            ФИО заявителя
          </label>
          <input
            id="applicantName"
            className="form__input"
            name="applicantName"
            value={values.applicantName}
            onChange={(event) => updateField("applicantName", event.target.value)}
            autoComplete="name"
            disabled={isSubmitting}
          />
          {fieldErrors.applicantName ? <p className="form__error">{fieldErrors.applicantName}</p> : null}
        </div>

        <div className="form__field">
          <label className="form__label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="form__input"
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
            disabled={isSubmitting}
          />
          {fieldErrors.email ? <p className="form__error">{fieldErrors.email}</p> : null}
        </div>

        <div className="form__field">
          <label className="form__label" htmlFor="phone">
            Телефон
          </label>
          <input
            id="phone"
            className="form__input"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            autoComplete="tel"
            disabled={isSubmitting}
          />
          {fieldErrors.phone ? <p className="form__error">{fieldErrors.phone}</p> : null}
        </div>

        <div className="form__field">
          <label className="form__label" htmlFor="subject">
            Тема
          </label>
          <input
            id="subject"
            className="form__input"
            name="subject"
            value={values.subject}
            onChange={(event) => updateField("subject", event.target.value)}
            disabled={isSubmitting}
          />
          {fieldErrors.subject ? <p className="form__error">{fieldErrors.subject}</p> : null}
        </div>

        <div className="form__field">
          <label className="form__label" htmlFor="description">
            Описание
          </label>
          <textarea
            id="description"
            className="form__textarea"
            name="description"
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
            disabled={isSubmitting}
          />
          {fieldErrors.description ? <p className="form__error">{fieldErrors.description}</p> : null}
        </div>

        {formError ? <p className="status-text status-text--error">{formError}</p> : null}

        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Создание..." : "Создать заявку"}
        </button>
      </form>
    </main>
  );
}
