import type { Response } from "express";
import { ENV } from "@/config/env.js";

const isProd = ENV.NODE_ENV === "production";

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true,                // ✅ FORZAR
    sameSite: "none",            // ✅ FORZAR
    maxAge: 3 * 60 * 60 * 1000,
    path: "/",
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,                // ✅ FORZAR
    sameSite: "none",            // ✅ FORZAR
    maxAge: ENV.REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
}
