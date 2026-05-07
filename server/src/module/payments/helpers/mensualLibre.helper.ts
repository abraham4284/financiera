import { Decimal } from "decimal.js";

export function shouldRenewMensualLibre(
  interestDue: string,
  interestPaidAccumulated: string,
) {
  return new Decimal(interestPaidAccumulated).gte(interestDue);
}
