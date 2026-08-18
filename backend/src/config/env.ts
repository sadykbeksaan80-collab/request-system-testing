import dotenv from "dotenv";

dotenv.config();

function getPort(value: string | undefined): number {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT должен быть целым числом от 1 до 65535");
  }

  return port;
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Не задана переменная окружения DATABASE_URL");
}

export const env = {
  port: getPort(process.env.PORT ?? "3000"),
  databaseUrl
} as const;
