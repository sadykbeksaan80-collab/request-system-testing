import { useParams } from "react-router-dom";

export function RequestDetailsPage() {
  const { id } = useParams();

  return <h1>Request Details: {id}</h1>;
}
