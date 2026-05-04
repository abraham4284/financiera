import jwt from "jsonwebtoken";
import { ENV } from "@/config/env.js";
import type {
  JwtAccessPayload,
  JwtRefreshPayload,
} from "@/module/auth/types/auth.types.js";

export function signAccessToken(payload: JwtAccessPayload): string {
  try {
    if (!ENV.TOKEN_SECRET) throw new Error("TOKEN_SECRET missing");
    return jwt.sign(payload, ENV.TOKEN_SECRET, {
      expiresIn: ENV.ACCESS_EXPIRES_IN,
    });
  } catch (error) {
    console.log({
      status: "ERROR",
      message: "Error signAccessToken",
      error: error,
    });
    throw error;
  }
}

export function verifyAccessToken(token: string): JwtAccessPayload {
  try {
    if (!ENV.TOKEN_SECRET) throw new Error("TOKEN_SECRET missing");
    return jwt.verify(token, ENV.TOKEN_SECRET) as JwtAccessPayload;
  } catch (error) {
    console.log({
      status: "ERROR",
      message: "Error verifyAccessToken",
      error: error,
    });
    throw error;
  }
}

export function signRefreshToken(payload: JwtRefreshPayload): string {
  try {
    if (!ENV.REFRESH_SECRET) throw new Error("REFRESH_SECRET missing");
    // refresh largo
    return jwt.sign(payload, ENV.REFRESH_SECRET, {
      expiresIn: `${ENV.REFRESH_EXPIRES_DAYS}d`,
    });
  } catch (error) {
    console.log({
      status: "ERROR",
      message: "Error signRefreshToken",
      error: error,
    });
    throw error;
  }
}

export function verifyRefreshToken(token: string): JwtRefreshPayload {
  try {
    if (!ENV.REFRESH_SECRET) throw new Error("REFRESH_SECRET missing");
    return jwt.verify(token, ENV.REFRESH_SECRET) as JwtRefreshPayload;
  } catch (error) {
    console.log({
      status: "ERROR",
      message: "Error verifyRefreshToken",
      error: error,
    });
    throw error;
  }
}
