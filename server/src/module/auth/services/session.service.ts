import bcrypt from "bcrypt";
import { pool } from "@/db/db.js";
import { ENV } from "@/config/env.js";

type CreateSessionParams = {
  idUser: number;
  refreshToken: string;
  userAgent?: string;
  ip?: string;
};

type CreateSessionResult = {
  sessionId: number;
  refreshTokenHash: string;
  expiresAt: Date;
};

export async function createSession(
  params: CreateSessionParams,
): Promise<CreateSessionResult> {
  const refreshTokenHash = await bcrypt.hash(params.refreshToken, 10);
  try {
    const expiresAt = new Date(
      Date.now() + ENV.REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    );


    // CALL sp_create_user_session(...) devuelve un SELECT con { idLogin }
    // mysql2 devuelve: [rows, fields]
    // En CALL, normalmente rows es un array de result sets: [ [ {idLogin: X} ], ... ]
    const [rows] = await pool.query<any[]>(
      "CALL sp_create_user_session(?,?,?,?,?)",
      [
        refreshTokenHash,
        expiresAt, // DATETIME
        params.userAgent ?? null,
        params.ip ?? null,
        params.idUser,
      ],
    );

    // rows[0] es el primer result set del SELECT del SP
    const sessionId = rows?.[0]?.[0]?.idLogin as number | undefined;

    if (!sessionId) {
      throw new Error("No se pudo crear la sesión (idLogin no retornado)");
    }

    return { sessionId, refreshTokenHash, expiresAt };
  } catch (error) {
    console.log({
      status: "ERROR",
      message: "Error createSession",
      error: error,
    });
    throw error;
  }
}

export async function revokeSession(sessionId: number): Promise<void> {
  try {
    await pool.execute(
      `UPDATE user_sessions
     SET revoked_at = NOW()
     WHERE idLogin = ? AND revoked_at IS NULL`,
      [sessionId],
    );
  } catch (error) {
    console.log({
      status: "ERROR",
      message: "Error revokeSession",
      error: error,
    });
  }
}
