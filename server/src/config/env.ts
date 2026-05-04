import type { StringValue } from "ms";
import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  TOKEN_SECRET: process.env.TOKEN_SECRET ?? "",
  REFRESH_SECRET: process.env.REFRESH_SECRET ?? "",
  ACCESS_EXPIRES_IN: (process.env.ACCESS_EXPIRES_IN ?? "3h") as StringValue,
  REFRESH_EXPIRES_DAYS: Number(process.env.REFRESH_EXPIRES_DAYS ?? 30),
};
