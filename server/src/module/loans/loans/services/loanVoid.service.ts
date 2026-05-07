import { pool } from "@db/db.js";
import { VoidLoanDTO } from "../types/loanVoid.types.js";

export async function voidLoanService(data: VoidLoanDTO) {
  try {
    const [result]: any = await pool.query(
      `CALL sp_loans_void(?, ?, @idVoidGlTransaction)`,
      [data.loanId, data.void_notes],
    );

    const [rows]: any = await pool.query(
      "SELECT @idVoidGlTransaction AS idVoidGlTransaction",
    );

    return {
      result: result[0]?.[0] ?? null,
      idVoidGlTransaction: rows[0]?.idVoidGlTransaction ?? null,
    };
  } catch (error: any) {
    console.log(error, "error en voidLoanService");
    throw new Error(error.sqlMessage || error.message);
  }
}
