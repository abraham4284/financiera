DROP PROCEDURE IF EXISTS sp_clients_create;
DROP PROCEDURE IF EXISTS sp_clients_update;
DROP PROCEDURE IF EXISTS sp_clients_toggle_status;
DROP PROCEDURE IF EXISTS sp_clients_get_all;
DROP PROCEDURE IF EXISTS sp_clients_get_by_id;

DELIMITER $$

CREATE PROCEDURE sp_clients_create(
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_dni VARCHAR(20),
    IN p_cuil VARCHAR(20),
    IN p_birth_date VARCHAR(45),
    IN p_maximum_indebtedness DECIMAL(18,2),
    IN p_idZone INT,
    OUT p_idClient INT
)
BEGIN
    DECLARE v_zone_exists INT DEFAULT 0;

    IF p_first_name IS NULL OR TRIM(p_first_name) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre es obligatorio';
    END IF;

    IF p_last_name IS NULL OR TRIM(p_last_name) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El apellido es obligatorio';
    END IF;

    IF p_maximum_indebtedness < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El límite de endeudamiento no puede ser negativo';
    END IF;

    SELECT COUNT(*)
    INTO v_zone_exists
    FROM zones
    WHERE idZone = p_idZone
      AND is_active = 1;

    IF v_zone_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La zona no existe o está inactiva';
    END IF;

    INSERT INTO clients (
        first_name,
        last_name,
        dni,
        cuil,
        birth_date,
        maximum_indebtedness,
        is_active,
        idZone
    ) VALUES (
        TRIM(p_first_name),
        TRIM(p_last_name),
        NULLIF(TRIM(p_dni), ''),
        NULLIF(TRIM(p_cuil), ''),
        NULLIF(TRIM(p_birth_date), ''),
        p_maximum_indebtedness,
        1,
        p_idZone
    );

    SET p_idClient = LAST_INSERT_ID();

    SELECT
        c.idClient,
        c.first_name,
        c.last_name,
        c.dni,
        c.cuil,
        c.birth_date,
        c.maximum_indebtedness,
        c.is_active,
        c.idZone,
        z.name AS zone_name
    FROM clients c
    INNER JOIN zones z ON z.idZone = c.idZone
    WHERE c.idClient = p_idClient;
END$$

CREATE PROCEDURE sp_clients_update(
    IN p_idClient INT,
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_dni VARCHAR(20),
    IN p_cuil VARCHAR(20),
    IN p_birth_date VARCHAR(45),
    IN p_maximum_indebtedness DECIMAL(18,2),
    IN p_idZone INT
)
BEGIN
    DECLARE v_client_exists INT DEFAULT 0;
    DECLARE v_zone_exists INT DEFAULT 0;

    SELECT COUNT(*)
    INTO v_client_exists
    FROM clients
    WHERE idClient = p_idClient;

    IF v_client_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente no existe';
    END IF;

    SELECT COUNT(*)
    INTO v_zone_exists
    FROM zones
    WHERE idZone = p_idZone
      AND is_active = 1;

    IF v_zone_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La zona no existe o está inactiva';
    END IF;

    IF p_first_name IS NULL OR TRIM(p_first_name) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre es obligatorio';
    END IF;

    IF p_last_name IS NULL OR TRIM(p_last_name) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El apellido es obligatorio';
    END IF;

    IF p_maximum_indebtedness < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El límite de endeudamiento no puede ser negativo';
    END IF;

    UPDATE clients
    SET
        first_name = TRIM(p_first_name),
        last_name = TRIM(p_last_name),
        dni = NULLIF(TRIM(p_dni), ''),
        cuil = NULLIF(TRIM(p_cuil), ''),
        birth_date = NULLIF(TRIM(p_birth_date), ''),
        maximum_indebtedness = p_maximum_indebtedness,
        idZone = p_idZone
    WHERE idClient = p_idClient;

    SELECT
        c.idClient,
        c.first_name,
        c.last_name,
        c.dni,
        c.cuil,
        c.birth_date,
        c.maximum_indebtedness,
        c.is_active,
        c.idZone,
        z.name AS zone_name
    FROM clients c
    INNER JOIN zones z ON z.idZone = c.idZone
    WHERE c.idClient = p_idClient;
END$$

CREATE PROCEDURE sp_clients_toggle_status(
    IN p_idClient INT,
    IN p_is_active TINYINT
)
BEGIN
    DECLARE v_client_exists INT DEFAULT 0;

    IF p_is_active NOT IN (0, 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El estado debe ser 0 o 1';
    END IF;

    SELECT COUNT(*)
    INTO v_client_exists
    FROM clients
    WHERE idClient = p_idClient;

    IF v_client_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente no existe';
    END IF;

    UPDATE clients
    SET is_active = p_is_active
    WHERE idClient = p_idClient;

    SELECT
        c.idClient,
        c.first_name,
        c.last_name,
        c.dni,
        c.cuil,
        c.birth_date,
        c.maximum_indebtedness,
        c.is_active,
        c.idZone,
        z.name AS zone_name
    FROM clients c
    INNER JOIN zones z ON z.idZone = c.idZone
    WHERE c.idClient = p_idClient;
END$$

CREATE PROCEDURE sp_clients_get_all(
    IN p_only_active TINYINT,
    IN p_idZone INT
)
BEGIN
    SELECT
        c.idClient,
        c.first_name,
        c.last_name,
        c.dni,
        c.cuil,
        c.birth_date,
        c.maximum_indebtedness,
        c.is_active,
        c.idZone,
        z.name AS zone_name
    FROM clients c
    INNER JOIN zones z ON z.idZone = c.idZone
    WHERE (p_only_active = 0 OR c.is_active = 1)
      AND (p_idZone IS NULL OR c.idZone = p_idZone)
    ORDER BY c.last_name ASC, c.first_name ASC;
END$$

CREATE PROCEDURE sp_clients_get_by_id(
    IN p_idClient INT
)
BEGIN
    SELECT
        c.idClient,
        c.first_name,
        c.last_name,
        c.dni,
        c.cuil,
        c.birth_date,
        c.maximum_indebtedness,
        c.is_active,
        c.idZone,
        z.name AS zone_name
    FROM clients c
    INNER JOIN zones z ON z.idZone = c.idZone
    WHERE c.idClient = p_idClient;
END$$

DELIMITER ;