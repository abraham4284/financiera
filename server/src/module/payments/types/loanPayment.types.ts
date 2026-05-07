export interface CreateLoanPaymentDTO {
    payment_date: string;
    amount: string;
    payment_method:
      | "CASH"
      | "TRANSFER"
      | "BANK_DEPOSIT"
      | "MERCADO_PAGO"
      | "CARD"
      | "OTHER";
    reference?: string;
    received_by?: string;
    idLoans: number;
    idAccount: number;
    idGlCategorie: number;
  }