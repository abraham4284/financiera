import { Decimal } from "decimal.js";

export interface CalculateMensualLibreRenewalParams {
  currentPrincipal: string;
  interestDue: string;
  interestPaid: string;
  principalPaid: string;
  interestRate: string;
}

export function calculateMensualLibreRenewal(
  params: CalculateMensualLibreRenewalParams,
) {
  const currentPrincipal = new Decimal(params.currentPrincipal);
  const interestDue = new Decimal(params.interestDue);
  const interestPaid = new Decimal(params.interestPaid);
  const principalPaid = new Decimal(params.principalPaid);
  const interestRate = new Decimal(params.interestRate);
  console.log({
    currentPrincipal,
    interestDue,
    interestPaid,
    principalPaid,
    interestRate,
  },'datos obtenidos');

  const canRenew = interestPaid.gte(interestDue);

  const excessToPrincipal = principalPaid.gt(0)
    ? principalPaid
    : new Decimal(0);

  console.log(excessToPrincipal, "excessToPrincipal");

  const newPrincipal = Decimal.max(
    currentPrincipal.minus(excessToPrincipal),
    0,
  );

  const newInterestAmount = newPrincipal
    .mul(interestRate)
    .div(100)
    .toDecimalPlaces(2);

  const newTotalDue = newPrincipal.plus(newInterestAmount);

  return {
    canRenew,
    excess_to_principal: excessToPrincipal.toFixed(2),
    suggested_new_principal: newPrincipal.toFixed(2),
    suggested_interest_rate: interestRate.toFixed(2),
    suggested_interest_amount: newInterestAmount.toFixed(2),
    suggested_total_due: newTotalDue.toFixed(2),
  };
}

export function addOneMonthSafe(dateValue: string | Date) {
  const date =
    dateValue instanceof Date
      ? new Date(dateValue)
      : new Date(String(dateValue));

  if (Number.isNaN(date.getTime())) {
    throw new Error("Fecha inválida en addOneMonthSafe");
  }

  const day = date.getDate();

  if (day > 28) {
    return new Date(date.getFullYear(), date.getMonth() + 2, 1)
      .toISOString()
      .split("T")[0];
  }

  return new Date(date.getFullYear(), date.getMonth() + 1, day)
    .toISOString()
    .split("T")[0];
}
