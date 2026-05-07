export interface VoidLoanDTO {
    loanId: number;
    void_notes: string;
  }
  
  export interface VoidLoanResult {
    idLoans: number;
    idVoidGlTransaction: number;
    idOriginalGlTransaction: number;
    idAccountRefunded: number;
    refundedAmount: string;
  }