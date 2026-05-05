import { pool } from "@db/db.js";
import { CreateLoanDTO } from "../types/loan.types.js";
import { buildLoanSchedule } from "../helpers/loanSchedule.helper.js";

export async function createLoanService(data: CreateLoanDTO) {
  const schedule = buildLoanSchedule({
    loan_type: data.loan_type,
    principal_original: data.principal_original,
    installments_count: data.installments_count,
    installment_amount: data.installment_amount,
    disbursement_date: data.disbursement_date,
  });

  const firstDueDate = schedule[0].due_date;
  const maturityDate = schedule[schedule.length - 1].due_date;

  const [result]: any = await pool.query(
    "CALL sp_loans_create_with_origin(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @idLoan, @idGlTransaction)",
    [
      data.loan_number,
      data.origin_type,
      data.loan_type,
      data.principal_original,
      data.installments_count,
      data.installment_amount,
      data.disbursement_date,
      data.first_due_date,
      maturityDate,
      data.currency,
      data.notes ?? null,
      data.parent_loan_id ?? null,
      data.root_loan_id ?? null,
      data.idClient,
      data.idDisbursementAccount,
      data.idGlCategorie,
      JSON.stringify(schedule),
      JSON.stringify(data.guarantors ?? []),
      JSON.stringify(data.comissions ?? []),
    ],
  );

  const [rows]: any = await pool.query(
    "SELECT @idLoan AS idLoan, @idGlTransaction AS idGlTransaction",
  );

  return {
    idLoan: rows[0].idLoan,
    idGlTransaction: rows[0].idGlTransaction,
    result,
  };
}
