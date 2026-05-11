DROP PROCEDURE IF EXISTS sp_accounts_create;

DELIMITER $$

CREATE PROCEDURE sp_accounts_create(
    IN p_name VARCHAR(120),
    IN p_type ENUM('CASH','BANK','WALLET','OTHER','LOAN_RECEIVABLE','EQUITY'),
    IN p_currency CHAR(3),
    IN p_balance DECIMAL(18,2),
    OUT p_idAccount INT
)
BEGIN
    IF p_name IS NULL OR TRIM(p_name) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre de la cuenta es obligatorio';
    END IF;

    IF p_balance < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El saldo inicial no puede ser negativo';
    END IF;

    INSERT INTO accounts (
        name,
        type,
        currency,
        balance,
        is_active,
        created_at
    ) VALUES (
        TRIM(p_name),
        p_type,
        UPPER(p_currency),
        p_balance,
        1,
        NOW()
    );

    SET p_idAccount = LAST_INSERT_ID();

    SELECT
        idAccount,
        name,
        type,
        currency,
        balance,
        is_active,
        created_at
    FROM accounts
    WHERE idAccount = p_idAccount;
END$$

DELIMITER ;


DROP PROCEDURE IF EXISTS sp_accounts_update;

DELIMITER $$

CREATE PROCEDURE sp_accounts_update(
    IN p_idAccount INT,
    IN p_name VARCHAR(120),
    IN p_type ENUM('CASH','BANK','WALLET','OTHER','LOAN_RECEIVABLE','EQUITY'),
    IN p_currency CHAR(3)
)
BEGIN
    DECLARE v_exists INT DEFAULT 0;

    IF p_name IS NULL OR TRIM(p_name) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre de la cuenta es obligatorio';
    END IF;

    SELECT COUNT(*)
    INTO v_exists
    FROM accounts
    WHERE idAccount = p_idAccount;

    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cuenta no existe';
    END IF;

    UPDATE accounts
    SET
        name = TRIM(p_name),
        type = p_type,
        currency = UPPER(p_currency)
    WHERE idAccount = p_idAccount;

    SELECT
        idAccount,
        name,
        type,
        currency,
        balance,
        is_active,
        created_at
    FROM accounts
    WHERE idAccount = p_idAccount;
END$$

DELIMITER ;


DROP PROCEDURE IF EXISTS sp_accounts_toggle_status;

DELIMITER $$

CREATE PROCEDURE sp_accounts_toggle_status(
    IN p_idAccount INT,
    IN p_is_active TINYINT
)
BEGIN
    DECLARE v_exists INT DEFAULT 0;

    SELECT COUNT(*)
    INTO v_exists
    FROM accounts
    WHERE idAccount = p_idAccount;

    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cuenta no existe';
    END IF;

    UPDATE accounts
    SET is_active = p_is_active
    WHERE idAccount = p_idAccount;

    SELECT
        idAccount,
        name,
        type,
        currency,
        balance,
        is_active,
        created_at
    FROM accounts
    WHERE idAccount = p_idAccount;
END$$

DELIMITER ;



DROP PROCEDURE IF EXISTS sp_accounts_get_all;

DELIMITER $$

CREATE PROCEDURE sp_accounts_get_all(
    IN p_only_active TINYINT
)
BEGIN
    SELECT
        idAccount,
        name,
        type,
        currency,
        balance,
        is_active,
        created_at
    FROM accounts
    WHERE p_only_active = 0 OR is_active = 1
    ORDER BY name ASC;
END$$

DELIMITER ;


DROP PROCEDURE IF EXISTS sp_accounts_get_by_id;

DELIMITER $$

CREATE PROCEDURE sp_accounts_get_by_id(
    IN p_idAccount INT
)
BEGIN
    SELECT
        idAccount,
        name,
        type,
        currency,
        balance,
        is_active,
        created_at
    FROM accounts
    WHERE idAccount = p_idAccount;
END$$

DELIMITER ;