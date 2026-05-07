import { Decimal } from "decimal.js";
import { pool } from "@db/db.js";
import { CreateLoanRenewalDTO } from "../types/loanRenewal.types.js";
import {
  addOneMonthSafe,
  calculateMensualLibreRenewal,
} from "../helpers/loanRenewal.helper.js";

export async function getMensualLibreRenewalProposalService(loanId: number) {
  const [rows]: any = await pool.query(
    `
    SELECT
      l.idLoans,
      l.loan_number,
      l.principal_current,
      l.loan_type,
      l.status AS loan_status,
      ld.idLoanDetail,
      ld.installment_number,
      ld.due_date,
      ld.principal_due,
      ld.interest_due,
      ld.total_due,
      ld.principal_paid,
      ld.interest_paid,
      ld.total_paid,
      ld.balance_due,
      ld.status AS detail_status
    FROM loans l
    INNER JOIN loan_details ld
      ON ld.idLoans = l.idLoans
    WHERE l.idLoans = ?
      AND l.loan_type = 'MENSUAL_LIBRE'
      AND ld.status IN ('PENDING','PARTIAL','OVERDUE')
    ORDER BY ld.due_date ASC, ld.idLoanDetail ASC
    LIMIT 1
    `,
    [loanId],
  );

  const current = rows[0];

  if (!current) {
    throw new Error(
      "No se encontró un período mensual libre pendiente para renovar",
    );
  }

  const calculation = calculateMensualLibreRenewal({
    currentPrincipal: String(current.principal_due),
    interestDue: String(current.interest_due),
    interestPaid: String(current.interest_paid),
    principalPaid: String(current.principal_paid),
    interestRate: "40",
  });

  return {
    idLoans: current.idLoans,
    idLoanDetail: current.idLoanDetail,
    loan_number: current.loan_number,
    current_due_date: current.due_date,
    current_principal: String(current.principal_current),
    interest_due: String(current.interest_due),
    total_due: String(current.total_due),
    interest_paid: String(current.interest_paid),
    principal_paid: String(current.principal_paid),
    total_paid: String(current.total_paid),
    suggested_new_due_date: addOneMonthSafe(current.due_date),
    ...calculation,
  };
}

export async function createLoanRenewalService(data: CreateLoanRenewalDTO) {
  const proposal = await getMensualLibreRenewalProposalService(data.loan_id);

  if (proposal.idLoanDetail !== data.current_loan_detail_id) {
    throw new Error(
      "El período enviado no coincide con el período pendiente actual",
    );
  }

  if (!proposal.canRenew) {
    throw new Error(
      "No se puede renovar: el interés del período actual no está cubierto",
    );
  }

  const previousPrincipal = new Decimal(proposal.current_principal);
  const newPrincipal = new Decimal(data.new_principal);

  if (!data.allow_principal_increase && newPrincipal.gt(previousPrincipal)) {
    throw new Error(
      "El nuevo capital no puede ser mayor al capital anterior, salvo que sea una reestructuración",
    );
  }

  const [result]: any = await pool.query(
    `
    CALL sp_loan_renewals_create(
      ?, ?, ?, ?, ?, ?, ?, @idNewLoanDetail
    )
    `,
    [
      data.loan_id,
      data.current_loan_detail_id,
      data.new_principal,
      data.new_interest_rate,
      data.new_total_due,
      data.new_due_date,
      data.notes ?? null,
    ],
  );

  const [rows]: any = await pool.query(
    "SELECT @idNewLoanDetail AS idNewLoanDetail",
  );

  return {
    idNewLoanDetail: rows[0].idNewLoanDetail,
    result,
  };
}
