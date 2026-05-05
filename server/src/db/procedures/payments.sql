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
    DECLARE v_total INT;

    START TRANSACTION;

    INSERT INTO loan_payments (
        payment_date,
        amount,
        payment_method,
        reference,
        received_by,
        created_at,
        idLoans,
        idAccount
    ) VALUES (
        p_payment_date,
        p_amount,
        p_payment_method,
        p_reference,
        p_received_by,
        NOW(),
        p_idLoans,
        p_idAccount
    );

    SET v_payment_id = LAST_INSERT_ID();

    -- GL TRANSACTION
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

    -- LINEA CONTABLE
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

    -- ACTUALIZA SALDO CUENTA
    UPDATE accounts
    SET balance = balance + p_amount
    WHERE idAccount = p_idAccount;

    -- APLICACIONES
    SET v_total = JSON_LENGTH(p_allocations_json);

    WHILE v_i < v_total DO

        INSERT INTO loan_payment_allocations (
            applied_to,
            amount,
            created_at,
            idPayment,
            idLoanDetail
        ) VALUES (
            JSON_UNQUOTE(JSON_EXTRACT(p_allocations_json, CONCAT('$[',v_i,'].allocations[0].type'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_allocations_json, CONCAT('$[',v_i,'].allocations[0].amount'))),
            NOW(),
            v_payment_id,
            JSON_UNQUOTE(JSON_EXTRACT(p_allocations_json, CONCAT('$[',v_i,'].idLoanDetail')))
        );

        SET v_i = v_i + 1;

    END WHILE;

    COMMIT;

END$$

DELIMITER ;