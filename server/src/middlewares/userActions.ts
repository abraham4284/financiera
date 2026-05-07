import type { Response, Request, NextFunction } from "express";
import { pool } from "@/db/db.js";

export async function userAction(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const methodAudit = ["GET","POST", "PUT", "DELETE"];
    if (!methodAudit.includes(req.method)) return next();

    if (!req.user?.idUser) return next();

    const ip =
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"] || "";
    const date = new Date().toISOString().split("T")[0];
    const hour = new Date().toLocaleTimeString("es-AR");

    // Registro general
    const action = `Method: ${req.method} - Ruta: ${req.originalUrl}`;
    console.log(req.user.idUser,'')
     const [result] = await pool.query("CALL sp_user_actions_create(?,?,?,?,?)", [
      action,
      req.method,
      ip,
      userAgent,
      req.user.idUser,
    ]);
    next();
  } catch (error) {
    console.log("Error in audit:", error);
    next(); // Nunca interrumpir la acción por error de log
  }
}
