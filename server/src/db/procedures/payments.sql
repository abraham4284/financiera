
DROP PROCEDURE IF EXISTS sp_loan_payments_create;

DELIMITER $$

CREATE PROCEDURE sp_loan_payments_create(
    IN p_payment_date DATE,
    IN p_amount DECIMAL(18,2),
    IN p_payment_method VARCHAR(50),
    IN p_reference VARCHAR(100),
    IN p_received_by VARCHAR(100),
    IN p_idLoans INT,
    IN p_idAccount INT,
    IN p_idGlCategorie INT,
    IN p_allocations_json JSON
)
BEGIN
    DECLARE v_payment_id INT;
    DECLARE v_gl_id INT;

    DECLARE v_i INT DEFAULT 0;
    DECLARE v_j INT DEFAULT 0;
    DECLARE v_total_details INT DEFAULT 0;
    DECLARE v_total_allocations INT DEFAULT 0;

    DECLARE v_idLoanDetail INT;
    DECLARE v_applied_to VARCHAR(50);
    DECLARE v_allocation_amount DECIMAL(18,2);

    DECLARE v_total_balance DECIMAL(18,2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    IF p_amount <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El pago debe ser mayor a 0';
    END IF;

    SELECT COALESCE(SUM(balance_due), 0)
    INTO v_total_balance
    FROM loan_details
    WHERE idLoans = p_idLoans
      AND status IN ('PENDING','PARTIAL','OVERDUE');

    IF p_amount > v_total_balance THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El pago no puede superar el saldo pendiente del crédito';
    END IF;

    START TRANSACTION;

    INSERT INTO loan_payments (
        payment_date,
        amount,
        payment_method,
        reference,
        received_by,
        created_at,
        idGlTransactionReceipt,
        idLoans,
        idAccount
    ) VALUES (
        p_payment_date,
        p_amount,
        p_payment_method,
        p_reference,
        p_received_by,
        NOW(),
        NULL,
        p_idLoans,
        p_idAccount
    );

    SET v_payment_id = LAST_INSERT_ID();

    INSERT INTO gl_transactions (
        transaction_date,
        description,
        source_module,
        source_id,
        status,
        created_at
    ) VALUES (
        p_payment_date,
        CONCAT('Pago préstamo ', p_idLoans),
        'LOAN_PAYMENT',
        v_payment_id,
        'POSTED',
        NOW()
    );

    SET v_gl_id = LAST_INSERT_ID();

    UPDATE loan_payments
    SET idGlTransactionReceipt = v_gl_id
    WHERE idPayment = v_payment_id;

    INSERT INTO gl_transaction_lines (
        entry_type,
        amount,
        note,
        created_at,
        idGlTransaction,
        idAccount,
        idGlCategorie
    ) VALUES (
        'DEBIT',
        p_amount,
        'Ingreso por pago préstamo',
        NOW(),
        v_gl_id,
        p_idAccount,
        p_idGlCategorie
    );

    UPDATE accounts
    SET balance = balance + p_amount
    WHERE idAccount = p_idAccount;

    SET v_total_details = JSON_LENGTH(p_allocations_json);
    SET v_i = 0;

    WHILE v_i < v_total_details DO

        SET v_idLoanDetail = CAST(
            JSON_UNQUOTE(
                JSON_EXTRACT(p_allocations_json, CONCAT('$[', v_i, '].idLoanDetail'))
            ) AS UNSIGNED
        );

        SET v_total_allocations = JSON_LENGTH(
            JSON_EXTRACT(p_allocations_json, CONCAT('$[', v_i, '].allocations'))
        );

        SET v_j = 0;

        WHILE v_j < v_total_allocations DO

            SET v_applied_to = JSON_UNQUOTE(
                JSON_EXTRACT(
                    p_allocations_json,
                    CONCAT('$[', v_i, '].allocations[', v_j, '].type')
                )
            );

            SET v_allocation_amount = CAST(
                JSON_UNQUOTE(
                    JSON_EXTRACT(
                        p_allocations_json,
                        CONCAT('$[', v_i, '].allocations[', v_j, '].amount')
                    )
                ) AS DECIMAL(18,2)
            );

            INSERT INTO loan_payment_allocations (
                applied_to,
                amount,
                created_at,
                idPayment,
                idLoanDetail
            ) VALUES (
                v_applied_to,
                v_allocation_amount,
                NOW(),
                v_payment_id,
                v_idLoanDetail
            );

            UPDATE loan_details
            SET
                interest_paid = interest_paid + IF(v_applied_to = 'INTEREST', v_allocation_amount, 0),
                principal_paid = principal_paid + IF(v_applied_to = 'PRINCIPAL', v_allocation_amount, 0),
                late_fee_paid = late_fee_paid + IF(v_applied_to = 'LATE_FEE', v_allocation_amount, 0),
                other_charges_paid = other_charges_paid + IF(v_applied_to = 'OTHER_CHARGES', v_allocation_amount, 0),
                total_paid = total_paid + v_allocation_amount
            WHERE idLoanDetail = v_idLoanDetail
              AND idLoans = p_idLoans;

            SET v_j = v_j + 1;

        END WHILE;

        UPDATE loan_details
        SET
            balance_due = GREATEST(
                total_due - (
                    principal_paid +
                    interest_paid +
                    late_fee_paid +
                    other_charges_paid
                ),
                0
            ),
            status = CASE
                WHEN GREATEST(
                    total_due - (
                        principal_paid +
                        interest_paid +
                        late_fee_paid +
                        other_charges_paid
                    ),
                    0
                ) = 0 THEN 'PAID'

                WHEN (
                    principal_paid +
                    interest_paid +
                    late_fee_paid +
                    other_charges_paid
                ) > 0 THEN 'PARTIAL'

                WHEN due_date < CURDATE() THEN 'OVERDUE'

                ELSE 'PENDING'
            END
        WHERE idLoanDetail = v_idLoanDetail
          AND idLoans = p_idLoans;

        SET v_i = v_i + 1;

    END WHILE;

    UPDATE loans
    SET
        principal_current = (
            SELECT COALESCE(SUM(principal_due - principal_paid), 0)
            FROM loan_details
            WHERE idLoans = p_idLoans
              AND status <> 'CANCELLED'
        ),
        status = CASE
            WHEN (
                SELECT COALESCE(SUM(balance_due), 0)
                FROM loan_details
                WHERE idLoans = p_idLoans
                  AND status <> 'CANCELLED'
            ) = 0 THEN 'PAID'
            ELSE status
        END
    WHERE idLoans = p_idLoans;

    COMMIT;

    SELECT
        v_payment_id AS idPayment,
        v_gl_id AS idGlTransactionReceipt;
END$$

DELIMITER ;