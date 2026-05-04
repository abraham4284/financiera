DROP PROCEDURE IF EXISTS sp_gl_manual_expense_create;
DELIMITER $$

CREATE PROCEDURE sp_gl_manual_expense_create(
    IN p_transaction_date DATE,
    IN p_description VARCHAR(255),
    IN p_idAccount INT,
    IN p_idGlCategorie INT,
    IN p_amount DECIMAL(18,2),
    IN p_note VARCHAR(255),
    OUT p_idGlTransaction INT
)
BEGIN
    DECLARE v_account_exists INT DEFAULT 0;
    DECLARE v_category_exists INT DEFAULT 0;
    DECLARE v_category_nature VARCHAR(50);
    DECLARE v_current_balance DECIMAL(18,2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    IF p_amount <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El monto debe ser mayor a 0';
    END IF;

    SELECT COUNT(*), COALESCE(MAX(balance), 0)
    INTO v_account_exists, v_current_balance
    FROM accounts
    WHERE idAccount = p_idAccount
      AND is_active = 1;

    IF v_account_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cuenta no existe o está inactiva';
    END IF;

    SELECT COUNT(*), MAX(nature)
    INTO v_category_exists, v_category_nature
    FROM gl_categories
    WHERE idGlCategorie = p_idGlCategorie
      AND is_active = 1;

    IF v_category_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La categoría no existe o está inactiva';
    END IF;

    IF v_category_nature <> 'EXPENSE' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La categoría debe ser de tipo EXPENSE';
    END IF;

    IF v_current_balance < p_amount THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Saldo insuficiente en la cuenta';
    END IF;

    START TRANSACTION;

    INSERT INTO gl_transactions (
        transaction_date,
        description,
        source_module,
        source_id,
        status,
        created_at
    ) VALUES (
        p_transaction_date,
        p_description,
        'MANUAL',
        NULL,
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
        p_amount,
        p_note,
        NOW(),
        p_idGlTransaction,
        p_idAccount,
        p_idGlCategorie
    );

    UPDATE accounts
    SET balance = balance - p_amount
    WHERE idAccount = p_idAccount;

    COMMIT;
END$$

DELIMITER ;


DROP PROCEDURE IF EXISTS sp_gl_manual_transfer_create;

DELIMITER $$

CREATE PROCEDURE sp_gl_manual_transfer_create(
    IN p_transaction_date DATE,
    IN p_description VARCHAR(255),
    IN p_idAccountFrom INT,
    IN p_idAccountTo INT,
    IN p_idGlCategorie INT,
    IN p_amount DECIMAL(18,2),
    IN p_note VARCHAR(255),
    OUT p_idGlTransaction INT
)
BEGIN
    DECLARE v_account_from_exists INT DEFAULT 0;
    DECLARE v_account_to_exists INT DEFAULT 0;
    DECLARE v_category_exists INT DEFAULT 0;
    DECLARE v_category_nature VARCHAR(50);
    DECLARE v_current_balance DECIMAL(18,2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    IF p_amount <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El monto debe ser mayor a 0';
    END IF;

    IF p_idAccountFrom = p_idAccountTo THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cuenta origen y destino no pueden ser la misma';
    END IF;

    SELECT COUNT(*), COALESCE(MAX(balance), 0)
    INTO v_account_from_exists, v_current_balance
    FROM accounts
    WHERE idAccount = p_idAccountFrom
      AND is_active = 1;

    IF v_account_from_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cuenta origen no existe o está inactiva';
    END IF;

    SELECT COUNT(*)
    INTO v_account_to_exists
    FROM accounts
    WHERE idAccount = p_idAccountTo
      AND is_active = 1;

    IF v_account_to_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cuenta destino no existe o está inactiva';
    END IF;

    SELECT COUNT(*), MAX(nature)
    INTO v_category_exists, v_category_nature
    FROM gl_categories
    WHERE idGlCategorie = p_idGlCategorie
      AND is_active = 1;

    IF v_category_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La categoría no existe o está inactiva';
    END IF;

    IF v_category_nature <> 'TRANSFER' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La categoría debe ser de tipo TRANSFER';
    END IF;

    IF v_current_balance < p_amount THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Saldo insuficiente en la cuenta origen';
    END IF;

    START TRANSACTION;

    INSERT INTO gl_transactions (
        transaction_date,
        description,
        source_module,
        source_id,
        status,
        created_at
    ) VALUES (
        p_transaction_date,
        p_description,
        'TRANSFER',
        NULL,
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
        p_amount,
        CONCAT('Salida por transferencia. ', COALESCE(p_note, '')),
        NOW(),
        p_idGlTransaction,
        p_idAccountFrom,
        p_idGlCategorie
    );

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
        CONCAT('Entrada por transferencia. ', COALESCE(p_note, '')),
        NOW(),
        p_idGlTransaction,
        p_idAccountTo,
        p_idGlCategorie
    );

    UPDATE accounts
    SET balance = balance - p_amount
    WHERE idAccount = p_idAccountFrom;

    UPDATE accounts
    SET balance = balance + p_amount
    WHERE idAccount = p_idAccountTo;

    COMMIT;
END$$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_gl_manual_adjustment_create;

DELIMITER $$

CREATE PROCEDURE sp_gl_manual_adjustment_create(
    IN p_transaction_date DATE,
    IN p_description VARCHAR(255),
    IN p_idAccount INT,
    IN p_idGlCategorie INT,
    IN p_entry_type ENUM('DEBIT','CREDIT'),
    IN p_amount DECIMAL(18,2),
    IN p_note VARCHAR(255),
    OUT p_idGlTransaction INT
)
BEGIN
    DECLARE v_account_exists INT DEFAULT 0;
    DECLARE v_category_exists INT DEFAULT 0;
    DECLARE v_category_nature VARCHAR(50);
    DECLARE v_current_balance DECIMAL(18,2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    IF p_amount <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El monto debe ser mayor a 0';
    END IF;

    IF p_entry_type NOT IN ('DEBIT', 'CREDIT') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Tipo de entrada inválido';
    END IF;

    SELECT COUNT(*), COALESCE(MAX(balance), 0)
    INTO v_account_exists, v_current_balance
    FROM accounts
    WHERE idAccount = p_idAccount
      AND is_active = 1;

    IF v_account_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cuenta no existe o está inactiva';
    END IF;

    SELECT COUNT(*), MAX(nature)
    INTO v_category_exists, v_category_nature
    FROM gl_categories
    WHERE idGlCategorie = p_idGlCategorie
      AND is_active = 1;

    IF v_category_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La categoría no existe o está inactiva';
    END IF;

    IF v_category_nature <> 'ADJUSTMENT' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La categoría debe ser de tipo ADJUSTMENT';
    END IF;

    IF p_entry_type = 'CREDIT' AND v_current_balance < p_amount THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Saldo insuficiente para realizar el ajuste';
    END IF;

    START TRANSACTION;

    INSERT INTO gl_transactions (
        transaction_date,
        description,
        source_module,
        source_id,
        status,
        created_at
    ) VALUES (
        p_transaction_date,
        p_description,
        'ADJUSTMENT',
        NULL,
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
        p_entry_type,
        p_amount,
        p_note,
        NOW(),
        p_idGlTransaction,
        p_idAccount,
        p_idGlCategorie
    );

    IF p_entry_type = 'DEBIT' THEN
        UPDATE accounts
        SET balance = balance + p_amount
        WHERE idAccount = p_idAccount;
    ELSE
        UPDATE accounts
        SET balance = balance - p_amount
        WHERE idAccount = p_idAccount;
    END IF;

    COMMIT;
END$$

DELIMITER ;


DROP PROCEDURE IF EXISTS sp_gl_transactions_get_all;
DELIMITER $$

CREATE PROCEDURE sp_gl_transactions_get_all()
BEGIN
    SELECT
        gt.idGlTransaction,
        gt.transaction_date,
        gt.description,
        gt.source_module,
        gt.source_id,
        gt.status,
        gt.created_at
    FROM gl_transactions gt
    ORDER BY gt.transaction_date DESC, gt.idGlTransaction DESC;
END$$

DELIMITER ;


DROP PROCEDURE IF EXISTS sp_gl_transaction_get_by_id;
DELIMITER $$

CREATE PROCEDURE sp_gl_transaction_get_by_id(
    IN p_idGlTransaction INT
)
BEGIN
    SELECT
        gt.idGlTransaction,
        gt.transaction_date,
        gt.description,
        gt.source_module,
        gt.source_id,
        gt.status,
        gt.created_at
    FROM gl_transactions gt
    WHERE gt.idGlTransaction = p_idGlTransaction;

    SELECT
        gtl.idGltransactionLine,
        gtl.entry_type,
        gtl.amount,
        gtl.note,
        gtl.created_at,
        gtl.idGlTransaction,
        gtl.idAccount,
        a.name AS account_name,
        a.type AS account_type,
        a.currency,
        gtl.idGlCategorie,
        gc.name AS category_name,
        gc.nature AS category_nature
    FROM gl_transaction_lines gtl
    INNER JOIN accounts a
        ON a.idAccount = gtl.idAccount
    INNER JOIN gl_categories gc
        ON gc.idGlCategorie = gtl.idGlCategorie
    WHERE gtl.idGlTransaction = p_idGlTransaction
    ORDER BY gtl.idGltransactionLine ASC;
END$$

DELIMITER ;