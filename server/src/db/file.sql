use db_financiera;

SELECT * FROM clients;
SELECT * FROM accounts;
SELECT * FROM employees;
SELECT * FROM gl_categories;
SELECT * FROM zones;
SELECT * FROM gl_transactions;
SELECT * FROM gl_transaction_lines;
SELECT * FROM loans;
SELECT * FROM loan_details;
SELECT * FROM loan_guarantors;
SELECT * FROM loan_comissions;
SELECT * FROM users;
SELECT * FROM roles;
SELECT * FROM user_actions;
SELECT * FROM loan_payments;
SELECT * FROM loan_payment_allocations;

SELECT * FROM loans WHERE idLoans = 4;
SELECT * FROM loan_details WHERE idLoans = 4;
SELECT * FROM loan_payment_allocations WHERE idLoanDetail = 13;
SELECT * FROM loan_payments WHERE idLoans = 4;


SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE loans;
TRUNCATE TABLE loan_details;
TRUNCATE TABLE loan_comissions;
TRUNCATE TABLE loan_guarantors;
TRUNCATE TABLE gl_transactions;
TRUNCATE TABLE gl_transaction_lines;
TRUNCATE TABLE loan_payments;
TRUNCATE TABLE loan_payment_allocations;
SET FOREIGN_KEY_CHECKS = 1;


UPDATE gl_categories SET is_system = 1 WHERE idGlCategorie = 6;


SELECT * FROM loans WHERE idLoans = 8;
SELECT * FROM loan_details WHERE idLoans = 4;


SELECT * FROM gl_categories WHERE nature = "TRANSFER";


CALL sp_gl_categories_get_by_nature("ADJUSTMENT");



SELECT * FROM gl_transaction_lines WHERE idGlTransaction = 16;


