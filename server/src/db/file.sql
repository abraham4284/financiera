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

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE loans;
TRUNCATE TABLE loan_details;
SET FOREIGN_KEY_CHECKS = 1;
SELECT * FROM loans WHERE idLoans = 8;
SELECT * FROM loan_details WHERE idLoans = 4;

DELIMITER $$
DROP PROCEDURE IF EXISTS createUserAction $
CREATE PROCEDURE createUserAction(
  IN p_action TEXT,
  IN p_method VARCHAR(45),
  IN p_date VARCHAR(45),
  IN p_hour VARCHAR(45),
  IN p_ip TEXT,
  IN p_user_agent TEXT,
  IN p_idUser INT
)
BEGIN
   INSERT INTO user_action (action,method, date, hour, ip, user_agent, idUser)
   VALUES (p_action,p_method, p_date, p_hour, p_ip, p_user_agent, p_idUser);
END $
DELIMITER ;
