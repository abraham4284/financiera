import { pool } from "@db/db.js";
import {
  CreateAccountDTO,
  ToggleAccountStatusDTO,
  UpdateAccountDTO,
} from "../types/account.types.js";

export async function createAccountService(data: CreateAccountDTO) {
  const [result]: any = await pool.query(
    "CALL sp_accounts_create(?, ?, ?, ?, @idAccount)",
    [data.name, data.type, data.currency, data.balance],
  );

  const [rows]: any = await pool.query("SELECT @idAccount AS idAccount");

  return {
    account: result[0]?.[0] ?? null,
    // idAccount: rows[0]?.idAccount ?? null,
  };
}

export async function getAccountsService(onlyActive = true) {
  const [rows]: any = await pool.query("CALL sp_accounts_get_all(?)", [
    onlyActive ? 1 : 0,
  ]);

  return rows[0];
}

export async function getAccountByIdService(idAccount: number) {
  const [rows]: any = await pool.query("CALL sp_accounts_get_by_id(?)", [
    idAccount,
  ]);

  return rows[0]?.[0] ?? null;
}

export async function updateAccountService(
  idAccount: number,
  data: UpdateAccountDTO,
) {
  const [rows]: any = await pool.query(
    "CALL sp_accounts_update(?, ?, ?, ?)",
    [idAccount, data.name, data.type, data.currency],
  );

  return rows[0]?.[0] ?? null;
}

export async function toggleAccountStatusService(
  idAccount: number,
  data: ToggleAccountStatusDTO,
) {
  const [rows]: any = await pool.query(
    "CALL sp_accounts_toggle_status(?, ?)",
    [idAccount, data.is_active],
  );

  return rows[0]?.[0] ?? null;
}