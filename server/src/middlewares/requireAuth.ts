import type { Response, Request, NextFunction } from "express";
import { verifyAccessToken } from "@/libs/tokens.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.access_token as string | undefined;
  let token = cookieToken;
  if (!token && req.headers.authorization) {
    const [bearer, jwtToken] = req.headers.authorization.split(" ");
    if (bearer === "Bearer" && jwtToken) token = jwtToken;
  }

  if (!token)
    return res.status(401).json({ status: "ERROR", message: "No autorizado" });
  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch (error) {
    console.log({
      status: "ERROR",
      message: "Error en requireAuth",
      error: error,
    });
    return res
      .status(401)
      .json({ status: "ERROR", message: "Token inválido/expirado" });
  }
}
