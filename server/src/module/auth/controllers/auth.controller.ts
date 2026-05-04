import type { Response, Request } from "express";
import bcrypt from "bcrypt";
import { pool } from "@/db/db.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/libs/tokens.js";
import { setAuthCookies, clearAuthCookies } from "@/libs/cookies.js";
import { createSession, revokeSession } from "../services/session.service.js";
import { ENV } from "@/config/env.js";

type RegisterBody = {
  username: string;
  password: string;
  img_url: string;
  idRole: number;
};

export async function register(
  req: Request<{}, {}, RegisterBody>,
  res: Response,
) {
  try {
    const { username, password, img_url,idRole } = req.body;

    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({
        status: "ERROR",
        message: "username y password son obligatorios",
      });
    }

    const [exists] = await pool.query<any>(
      "SELECT idUser FROM users WHERE username = ?",
      [username],
    );
    if (exists.length > 0) {
      return res.status(409).json({
        status: "ERROR",
        message: "El usuario ya existe",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query<any>("CALL sp_create_user(?,?,?,?)", [
      username,
      passwordHash,
      img_url,
      idRole
    ]);

    const idUser = result?.[0]?.[0]?.idUser as number;
    const accessToken = signAccessToken({ idUser, username });
    const refreshToken = signRefreshToken({ sid: 0, idUser });
    await createSession({
      idUser,
      refreshToken,
      userAgent: req.get("user-agent") ?? undefined,
      ip: req.ip,
    });

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      status: "OK",
      message: "Usuario registrado correctamente",
    });
  } catch (error) {
    console.log(error, "error en register controller");
    return res.status(500).json({
      status: "ERROR",
      message: "Error interno del servidor",
      error: error,
    });
  }
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refresh_token as string | undefined;
  if (!token)
    return res
      .status(401)
      .json({ status: "ERROR", message: "No refresh token" });

  let payload: { sid: number; idUser: number };
  try {
    payload = verifyRefreshToken(token);
  } catch (e) {
    return res
      .status(401)
      .json({ status: "ERROR", message: "Refresh inválido" });
  }

  // (MVP) buscar user
  const [rows] = await pool.query<any[]>(
    "SELECT idUser, username FROM users WHERE idUser = ?",
    [payload.idUser],
  );
  if (!rows.length)
    return res
      .status(401)
      .json({ status: "ERROR", message: "Usuario no existe" });

  const user = rows[0];
  const accessToken = signAccessToken({
    idUser: user.idUser,
    username: user.username,
  });

  // setear SOLO access, no hace falta setear refresh acá si no rotás
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });

  return res.json({ status: "OK", message: "Token refrescado" });
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };
    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({
        status: "ERROR",
        message: "username y password son obligatorios",
      });
    }

    const [rows] = await pool.execute<any[]>(
      "SELECT * FROM users WHERE username = ?",
      [username],
    );
    if (!rows.length)
      return res
        .status(401)
        .json({ status: "ERROR", message: "Credenciales inválidas" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);

    if (!ok)
      return res
        .status(401)
        .json({ status: "ERROR", message: "Credenciales inválidas" });

    const accessToken = signAccessToken({
      idUser: user.idUser,
      username: user.username,
    });
    const refreshToken = signRefreshToken({ sid: 0, idUser: user.idUser });

    await createSession({
      idUser: user.idUser,
      refreshToken,
      userAgent: req.get("user-agent") ?? undefined,
      ip: req.ip,
    });

    setAuthCookies(res, accessToken, refreshToken);
    return res.json({ status: "OK", message: "Login exitoso" });
  } catch (error) {
    console.log(error, "error en login controller");
    return res.status(500).json({
      status: "ERROR",
      message: "Error interno del servidor",
      error: error,
    });
  }
}

export async function me(req: Request, res: Response) {
  const token = req.cookies?.access_token as string | undefined;
  if (!token)
    return res
      .status(401)
      .json({ status: "ERROR", message: "No access token" });

  let payload: { idUser: number; username: string };
  try {
    payload = verifyAccessToken(token);
  } catch {
    return res
      .status(401)
      .json({ status: "ERROR", message: "Access inválido" });
  }

  // fuente de verdad: DB
  const [rows] = await pool.query<any[]>(
    "SELECT idUser, username FROM users WHERE idUser = ?",
    [payload.idUser],
  );
  if (!rows.length)
    return res
      .status(401)
      .json({ status: "ERROR", message: "Usuario no existe" });

  return res.json({
    status: "OK",
    message: "Usuario autenticado",
    data: rows[0],
  });
}

export async function logout(req: Request, res: Response) {
  // Si querés revocar la sesión actual, necesitás identificarla (por ejemplo guardando sessionId en refresh payload).
  // En tu MVP, podés revocar todas las sesiones del user si estás autenticado.
  // Opción: si hay refresh cookie, la validás y revocás las sesiones que matcheen el hash.
  clearAuthCookies(res);
  return res.json({ status: "OK", message: "Logout exitoso" });
}
