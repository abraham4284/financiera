import { pool } from "@db/db.js";
import { CreateLoanPaymentDTO } from "../types/loanPayment.types.js";
import { applyPaymentCascade } from "../helpers/paymentCascade.helper.js";

export async function createLoanPaymentService(data: CreateLoanPaymentDTO) {
  const [loanDetails]: any = await pool.query(
    `SELECT * FROM loan_details 
     WHERE idLoans = ? 
     AND status IN ('PENDING','PARTIAL','OVERDUE')
     ORDER BY due_date ASC`,
    [data.idLoans],
  );

  const allocations = applyPaymentCascade(data.amount, loanDetails);
  console.log(allocations,'allocations')

  const [result]: any = await pool.query(
    `CALL sp_loan_payments_create(
      ?,?,?,?,?,?,?,?,?
    )`,
    [
      data.payment_date,
      data.amount,
      data.payment_method,
      data.reference ?? null,
      data.received_by ?? null,
      data.idLoans,
      data.idAccount,
      data.idGlCategorie,
      JSON.stringify(allocations),
    ],
  );

  console.log(result,'soy result paymentLoan')

  return result;
}
