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
  disbursement_date: string;
}

export interface LoanScheduleItem {
  installment_number: number;
  due_date: string;
  principal_due: string;
  interest_due: string;
  other_charges_due: string;
  total_due: string;
  principal_remaining: string;
  notes?: string | null;
}

function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function addMonthsKeepingSafeDay(date: Date, months: number) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return new Date(year, month + months, day);
}

function normalizeMonthlyDisbursementDate(date: Date) {
  const day = date.getDate();

  if (day <= 28) {
    return date;
  }

  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function getBaseDueDate(params: BuildLoanScheduleParams) {
  const disbursementDate = new Date(params.disbursement_date + "T00:00:00");

  if (params.loan_type === "WEEKLY") {
    return addDays(disbursementDate, 7);
  }

  if (params.loan_type === "BIWEEKLY") {
    return addDays(disbursementDate, 15);
  }

  if (
    params.loan_type === "MONTHLY" ||
    params.loan_type === "MENSUAL_LIBRE" ||
    params.loan_type === "FIXED"
  ) {
    const normalizedDate = normalizeMonthlyDisbursementDate(disbursementDate);
    return addMonthsKeepingSafeDay(normalizedDate, 1);
  }

  return addMonthsKeepingSafeDay(disbursementDate, 1);
}

function getNextDueDate(baseDate: Date, loanType: LoanType, index: number) {
  if (loanType === "WEEKLY") {
    return addDays(baseDate, index * 7);
  }

  if (loanType === "BIWEEKLY") {
    return addDays(baseDate, index * 15);
  }

  if (
    loanType === "MONTHLY" ||
    loanType === "MENSUAL_LIBRE" ||
    loanType === "FIXED"
  ) {
    return addMonthsKeepingSafeDay(baseDate, index);
  }

  return addMonthsKeepingSafeDay(baseDate, index);
}

export function buildLoanSchedule(
  params: BuildLoanScheduleParams,
): LoanScheduleItem[] {
  const principal = new Decimal(params.principal_original);
  const installmentAmount = new Decimal(params.installment_amount);

  const installmentsCount =
    params.loan_type === "MENSUAL_LIBRE" ? 1 : params.installments_count;

  const baseDueDate = getBaseDueDate(params);

  if (params.loan_type === "MENSUAL_LIBRE") {
    const interestDue = installmentAmount.minus(principal);

    return [
      {
        installment_number: 1,
        due_date: formatDate(baseDueDate),
        principal_due: principal.toFixed(2),
        interest_due: interestDue.greaterThan(0)
          ? interestDue.toFixed(2)
          : "0.00",
        other_charges_due: "0.00",
        total_due: installmentAmount.toFixed(2),
        principal_remaining: "0.00",
        notes: "Mensual libre en una sola cuota",
      },
    ];
  }

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
      notes: null,
    });
  }

  return schedule;
}