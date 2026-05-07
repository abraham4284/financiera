export interface LoanRenewalProposal {
    idLoans: number;
    idLoanDetail: number;
    loan_number: string;
    current_due_date: string;
    current_principal: string;
    interest_due: string;
    total_due: string;
    interest_paid: string;
    principal_paid: string;
    total_paid: string;
    excess_to_principal: string;
    suggested_new_principal: string;
    suggested_interest_rate: string;
    suggested_interest_amount: string;
    suggested_total_due: string;
    suggested_new_due_date: string;
    canRenew: boolean;
  }
  
  export interface CreateLoanRenewalDTO {
    loan_id: number;
    current_loan_detail_id: number;
    new_principal: string;
    new_interest_rate: string;
    new_total_due: string;
    new_due_date: string;
    notes?: string;
    allow_principal_increase?: boolean;
  }