import { pool } from "@/db/db.js";

export async function getGlTransactionsService() {
  const [rows]: any = await pool.query("CALL sp_gl_transactions_get_all()");
  return rows[0];
}

export async function getGlTransactionByIdService(idGlTransaction: number) {
  const [rows]: any = await pool.query("CALL sp_gl_transaction_get_by_id(?)", [
    idGlTransaction,
  ]);

  return {
    transaction: rows[0]?.[0] ?? null,
    lines: rows[1] ?? [],
  };
}
