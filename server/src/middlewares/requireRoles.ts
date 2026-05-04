import type { Response, Request, NextFunction } from "express";

export function requireRoles(allowedRoles: number[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.status(401).json({
        status: "ERROR",
        message: "No autorizado",
      });
    }

    const userRoleId = req.user.idRole;

    if (!allowedRoles.includes(userRoleId)) {
      return res.status(403).json({
        status: "ERROR",
        message: "No tienes permisos para acceder a este recurso",
      });
    }

    return next();
  };
}