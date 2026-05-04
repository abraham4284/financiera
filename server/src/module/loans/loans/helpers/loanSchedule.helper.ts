import { Decimal } from "decimal.js";

export type LoanType =
  | "FIXED"
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "MENSUAL_LIBRE";

export interface BuildLoanScheduleParams {
  loan_type: LoanType;
  principal_original: string;
  installments_count: number;
  installment_amount: string;
  first_due_date: string;
}

export interface LoanScheduleItem {
  installment_number: number;
  due_date: string;
  principal_due: string;
  interest_due: string;
  other_charges_due: string;
  total_due: string;
  principal_remaining: string;
  notes?: string;
}

function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function addMonths(date: Date, months: number) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function getNextDueDate(baseDate: Date, loanType: LoanType, index: number) {
  if (loanType === "WEEKLY") return addDays(baseDate, index * 7);
  if (loanType === "BIWEEKLY") return addDays(baseDate, index * 14);
  if (loanType === "MONTHLY") return addMonths(baseDate, index);
  if (loanType === "MENSUAL_LIBRE") return addMonths(baseDate, index);

  return addMonths(baseDate, index);
}

export function buildLoanSchedule(
  params: BuildLoanScheduleParams,
): LoanScheduleItem[] {
  const principal = new Decimal(params.principal_original);
  const installmentAmount = new Decimal(params.installment_amount);
  const installmentsCount = params.installments_count;

  const baseDueDate = new Date(params.first_due_date + "T00:00:00");

  const principalPerInstallment = principal.div(installmentsCount);
  let principalRemaining = principal;

  const schedule: LoanScheduleItem[] = [];

  for (let i = 0; i < installmentsCount; i++) {
    const installmentNumber = i + 1;
    const dueDate = getNextDueDate(baseDueDate, params.loan_type, i);

    const principalDue =
      installmentNumber === installmentsCount
        ? principalRemaining
        : principalPerInstallment.toDecimalPlaces(2);

    const interestDue = installmentAmount.minus(principalDue);

    principalRemaining = principalRemaining.minus(principalDue);

    schedule.push({
      installment_number: installmentNumber,
      due_date: formatDate(dueDate),
      principal_due: principalDue.toFixed(2),
      interest_due: interestDue.greaterThan(0)
        ? interestDue.toFixed(2)
        : "0.00",
      other_charges_due: "0.00",
      total_due: installmentAmount.toFixed(2),
      principal_remaining: principalRemaining.greaterThan(0)
        ? principalRemaining.toFixed(2)
        : "0.00",
      notes: null as any,
    });
  }

  return schedule;
}
