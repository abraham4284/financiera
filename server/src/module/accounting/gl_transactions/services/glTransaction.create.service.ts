import { pool } from "@/db/db.js";
import {
  CreateAdjustmentDTO,
  CreateExpenseDTO,
  CreateTransferDTO,
} from "../types/glTransaction.types.js";

export async function createExpenseService(data: CreateExpenseDTO) {
  const [result]: any = await pool.query(
    "CALL sp_gl_manual_expense_create(?, ?, ?, ?, ?, ?, @idGlTransaction)",
    [
      data.transaction_date,
      data.description,
      data.idAccount,
      data.idGlCategorie,
      data.amount,
      data.note ?? null,
    ]
  );

  const [rows]: any = await pool.query(
    "SELECT @idGlTransaction AS idGlTransaction"
  );

  return {
    idGlTransaction: rows[0].idGlTransaction,
    result,
  };
}

export async function createTransferService(data: CreateTransferDTO) {
  const [result]: any = await pool.query(
    "CALL sp_gl_manual_transfer_create(?, ?, ?, ?, ?, ?, ?, @idGlTransaction)",
    [
      data.transaction_date,
      data.description,
      data.idAccountFrom,
      data.idAccountTo,
      data.idGlCategorie,
      data.amount,
      data.note ?? null,
    ]
  );

  const [rows]: any = await pool.query(
    "SELECT @idGlTransaction AS idGlTransaction"
  );

  return {
    idGlTransaction: rows[0].idGlTransaction,
    result,
  };
}

export async function createAdjustmentService(data: CreateAdjustmentDTO) {
  const [result]: any = await pool.query(
    "CALL sp_gl_manual_adjustment_create(?, ?, ?, ?, ?, ?, ?, @idGlTransaction)",
    [
      data.transaction_date,
      data.description,
      data.idAccount,
      data.idGlCategorie,
      data.entry_type,
      data.amount,
      data.note ?? null,
    ]
  );

  const [rows]: any = await pool.query(
    "SELECT @idGlTransaction AS idGlTransaction"
  );

  return {
    idGlTransaction: rows[0].idGlTransaction,
    result,
  };
}

