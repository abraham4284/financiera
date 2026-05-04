DELIMITER $$

CREATE PROCEDURE sp_loans_create_with_origin(
    IN p_loan_number VARCHAR(30),
    IN p_origin_type ENUM('ORIGINAL','REFINANCING','RESTRUCTURE'),
    IN p_loan_type ENUM('FIXED','WEEKLY','BIWEEKLY','MONTHLY','MENSUAL_LIBRE'),
    IN p_principal_original DECIMAL(18,2),
    IN p_installments_count INT,
    IN p_installment_amount DECIMAL(18,2),
    IN p_disbursement_date DATE,
    IN p_first_due_date DATE,
    IN p_maturity_date DATE,
    IN p_currency CHAR(3),
    IN p_notes TEXT,
    IN p_parent_loan_id INT,
    IN p_root_loan_id INT,
    IN p_idClient INT,
    IN p_idDisbursementAccount INT,
    IN p_idGlCategorie INT,
    IN p_schedule_json JSON,
    IN p_guarantors_json JSON,
    IN p_comissions_json JSON,
    OUT p_idLoan INT,
    OUT p_idGlTransaction INT
)
BEGIN
    DECLARE v_client_exists INT DEFAULT 0;
    DECLARE v_account_exists INT DEFAULT 0;
    DECLARE v_category_exists INT DEFAULT 0;
    DECLARE v_account_balance DECIMAL(18,2);
    DECLARE v_i INT DEFAULT 0;
    DECLARE v_total INT DEFAULT 0;

    DECLARE v_commission_type VARCHAR(30);
    DECLARE v_commission_rate DECIMAL(18,2);
    DECLARE v_commission_base DECIMAL(18,2);
    DECLARE v_commission_amount DECIMAL(18,2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    IF p_principal_original <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El capital debe ser mayor a 0';
    END IF;

    IF p_installments_count <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cantidad de cuotas debe ser mayor a 0';
    END IF;

    SELECT COUNT(*)
    INTO v_client_exists
    FROM clients
    WHERE idClient = p_idClient;

    IF v_client_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente no existe';
    END IF;

    SELECT COUNT(*), COALESCE(MAX(balance), 0)
    INTO v_account_exists, v_account_balance
    FROM accounts
    WHERE idAccount = p_idDisbursementAccount
      AND is_active = 1;

    IF v_account_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cuenta de desembolso no existe o está inactiva';
    END IF;

    IF v_account_balance < p_principal_original THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Saldo insuficiente para otorgar el préstamo';
    END IF;

    SELECT COUNT(*)
    INTO v_category_exists
    FROM gl_categories
    WHERE idGlCategorie = p_idGlCategorie
      AND is_active = 1;

    IF v_category_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La categoría contable no existe o está inactiva';
    END IF;

    START TRANSACTION;

    INSERT INTO loans (
        loan_number,
        origin_type,
        loan_type,
        principal_original,
        principal_current,
        installments_count,
        installment_amount,
        disbursement_date,
        first_due_date,
        maturity_date,
        status,
        currency,
        comission_status,
        notes,
        created_at,
        parent_loan_id,
        root_loan_id,
        idClient
    ) VALUES (
        p_loan_number,
        p_origin_type,
        p_loan_type,
        p_principal_original,
        p_principal_original,
        p_installments_count,
        p_installment_amount,
        p_disbursement_date,
        p_first_due_date,
        p_maturity_date,
        'ACTIVE',
        p_currency,
        IF(JSON_LENGTH(p_comissions_json) > 0, 'PENDING', 'NO_COMMISSION'),
        p_notes,
        NOW(),
        p_parent_loan_id,
        p_root_loan_id,
        p_idClient
    );

    SET p_idLoan = LAST_INSERT_ID();

    IF p_root_loan_id IS NULL THEN
        UPDATE loans
        SET root_loan_id = p_idLoan
        WHERE idLoans = p_idLoan;
    END IF;

    SET v_total = JSON_LENGTH(p_schedule_json);
    SET v_i = 0;

    WHILE v_i < v_total DO
        INSERT INTO loan_details (
            installment_number,
            due_date,
            principal_due,
            interest_due,
            other_charges_due,
            total_due,
            principal_paid,
            interest_paid,
            late_fee_paid,
            other_charges_paid,
            total_paid,
            balance_due,
            status,
            principal_remaining,
            notes,
            created_at,
            idLoans
        ) VALUES (
            JSON_UNQUOTE(JSON_EXTRACT(p_schedule_json, CONCAT('$[', v_i, '].installment_number'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_schedule_json, CONCAT('$[', v_i, '].due_date'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_schedule_json, CONCAT('$[', v_i, '].principal_due'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_schedule_json, CONCAT('$[', v_i, '].interest_due'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_schedule_json, CONCAT('$[', v_i, '].other_charges_due'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_schedule_json, CONCAT('$[', v_i, '].total_due'))),
            0,
            0,
            0,
            0,
            0,
            JSON_UNQUOTE(JSON_EXTRACT(p_schedule_json, CONCAT('$[', v_i, '].total_due'))),
            'PENDING',
            JSON_UNQUOTE(JSON_EXTRACT(p_schedule_json, CONCAT('$[', v_i, '].principal_remaining'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_schedule_json, CONCAT('$[', v_i, '].notes'))),
            NOW(),
            p_idLoan
        );

        SET v_i = v_i + 1;
    END WHILE;

    SET v_total = JSON_LENGTH(p_guarantors_json);
    SET v_i = 0;

    WHILE v_i < v_total DO
        INSERT INTO loan_guarantors (
            guarantee_type,
            liability_percentage,
            notes,
            is_active,
            created_at,
            idLoans,
            idClient
        ) VALUES (
            JSON_UNQUOTE(JSON_EXTRACT(p_guarantors_json, CONCAT('$[', v_i, '].guarantee_type'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_guarantors_json, CONCAT('$[', v_i, '].liability_percentage'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_guarantors_json, CONCAT('$[', v_i, '].notes'))),
            1,
            NOW(),
            p_idLoan,
            JSON_UNQUOTE(JSON_EXTRACT(p_guarantors_json, CONCAT('$[', v_i, '].idClient')))
        );

        SET v_i = v_i + 1;
    END WHILE;

    SET v_total = JSON_LENGTH(p_comissions_json);
    SET v_i = 0;

    WHILE v_i < v_total DO
        SET v_commission_type = JSON_UNQUOTE(JSON_EXTRACT(p_comissions_json, CONCAT('$[', v_i, '].commission_type')));
        SET v_commission_rate = JSON_UNQUOTE(JSON_EXTRACT(p_comissions_json, CONCAT('$[', v_i, '].commission_rate')));
        SET v_commission_base = JSON_UNQUOTE(JSON_EXTRACT(p_comissions_json, CONCAT('$[', v_i, '].commission_base_amount')));

        IF v_commission_type = 'PERCENTAGE' THEN
            SET v_commission_amount = ROUND(v_commission_base * v_commission_rate / 100, 2);
        ELSE
            SET v_commission_amount = v_commission_rate;
        END IF;

        INSERT INTO loan_comissions (
            role_in_loan,
            commission_type,
            commission_rate,
            commission_base_amount,
            commission_amount,
            status,
            generated_at,
            paid_at,
            notes,
            is_active,
            created_at,
            idLoans,
            idEmployee
        ) VALUES (
            JSON_UNQUOTE(JSON_EXTRACT(p_comissions_json, CONCAT('$[', v_i, '].role_in_loan'))),
            v_commission_type,
            v_commission_rate,
            v_commission_base,
            v_commission_amount,
            'PENDING',
            NOW(),
            NULL,
            JSON_UNQUOTE(JSON_EXTRACT(p_comissions_json, CONCAT('$[', v_i, '].notes'))),
            1,
            NOW(),
            p_idLoan,
            JSON_UNQUOTE(JSON_EXTRACT(p_comissions_json, CONCAT('$[', v_i, '].idEmployee')))
        );

        SET v_i = v_i + 1;
    END WHILE;

    INSERT INTO gl_transactions (
        transaction_date,
        description,
        source_module,
        source_id,
        status,
        created_at
    ) VALUES (
        p_disbursement_date,
        CONCAT('Desembolso préstamo ', p_loan_number),
        'LOAN',
        p_idLoan,
        'POSTED',
        NOW()
    );

    SET p_idGlTransaction = LAST_INSERT_ID();

    INSERT INTO gl_transaction_lines (
        entry_type,
        amount,
        note,
        created_at,
        idGlTransaction,
        idAccount,
        idGlCategorie
    ) VALUES (
        'CREDIT',
        p_principal_original,
        CONCAT('Salida de dinero por préstamo ', p_loan_number),
        NOW(),
        p_idGlTransaction,
        p_idDisbursementAccount,
        p_idGlCategorie
    );

    UPDATE accounts
    SET balance = balance - p_principal_original
    WHERE idAccount = p_idDisbursementAccount;

    COMMIT;
END$$

DELIMITER ;