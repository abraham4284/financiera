import { Decimal } from "decimal.js";

export type AllocationType =
  | "INTEREST"
  | "PRINCIPAL"
  | "LATE_FEE"
  | "OTHER_CHARGES";

export interface LoanDetailItem {
  idLoanDetail: number;
  interest_due: string;
  principal_due: string;
  other_charges_due: string;
  total_due: string;

  interest_paid: string;
  principal_paid: string;
  other_charges_paid: string;
  total_paid: string;

  balance_due: string;
}

export interface AllocationResult {
  idLoanDetail: number;
  allocations: {
    type: AllocationType;
    amount: string;
  }[];
}

export function applyPaymentCascade(
  paymentAmount: string,
  loanDetails: LoanDetailItem[],
): AllocationResult[] {
  let remaining = new Decimal(paymentAmount);

  const results: AllocationResult[] = [];

  for (const detail of loanDetails) {
    if (remaining.lte(0)) break;

    const allocations: AllocationResult["allocations"] = [];

    let interestRemaining = new Decimal(detail.interest_due).minus(
      detail.interest_paid,
    );

    let principalRemaining = new Decimal(detail.principal_due).minus(
      detail.principal_paid,
    );

    // 1️⃣ INTERÉS
    if (interestRemaining.gt(0)) {
      const applied = Decimal.min(interestRemaining, remaining);

      if (applied.gt(0)) {
        allocations.push({
          type: "INTEREST",
          amount: applied.toFixed(2),
        });

        remaining = remaining.minus(applied);
      }
    }

    // 2️⃣ CAPITAL
    if (principalRemaining.gt(0) && remaining.gt(0)) {
      const applied = Decimal.min(principalRemaining, remaining);

      allocations.push({
        type: "PRINCIPAL",
        amount: applied.toFixed(2),
      });

      remaining = remaining.minus(applied);
    }

    if (allocations.length > 0) {
      results.push({
        idLoanDetail: detail.idLoanDetail,
        allocations,
      });
    }
  }

  return results;
}
