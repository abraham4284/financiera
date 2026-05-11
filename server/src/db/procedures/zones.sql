DROP PROCEDURE IF EXISTS sp_zones_create;
DROP PROCEDURE IF EXISTS sp_zones_update;
DROP PROCEDURE IF EXISTS sp_zones_toggle_status;
DROP PROCEDURE IF EXISTS sp_zones_get_all;
DROP PROCEDURE IF EXISTS sp_zones_get_by_id;

DELIMITER $$

CREATE PROCEDURE sp_zones_create(
    IN p_name VARCHAR(100),
    IN p_description VARCHAR(255),
    OUT p_idZone INT
)
BEGIN
    IF p_name IS NULL OR TRIM(p_name) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre de la zona es obligatorio';
    END IF;

    INSERT INTO zones (
        name,
        description,
        is_active,
        created_at
    ) VALUES (
        TRIM(p_name),
        p_description,
        1,
        NOW()
    );

    SET p_idZone = LAST_INSERT_ID();

    SELECT
        idZone,
        name,
        description,
        is_active,
        created_at
    FROM zones
    WHERE idZone = p_idZone;
END$$

CREATE PROCEDURE sp_zones_update(
    IN p_idZone INT,
    IN p_name VARCHAR(100),
    IN p_description VARCHAR(255)
)
BEGIN
    DECLARE v_exists INT DEFAULT 0;

    IF p_name IS NULL OR TRIM(p_name) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre de la zona es obligatorio';
    END IF;

    SELECT COUNT(*)
    INTO v_exists
    FROM zones
    WHERE idZone = p_idZone;

    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La zona no existe';
    END IF;

    UPDATE zones
    SET
        name = TRIM(p_name),
        description = p_description
    WHERE idZone = p_idZone;

    SELECT
        idZone,
        name,
        description,
        is_active,
        created_at
    FROM zones
    WHERE idZone = p_idZone;
END$$

CREATE PROCEDURE sp_zones_toggle_status(
    IN p_idZone INT,
    IN p_is_active TINYINT
)
BEGIN
    DECLARE v_exists INT DEFAULT 0;

    IF p_is_active NOT IN (0, 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El estado debe ser 0 o 1';
    END IF;

    SELECT COUNT(*)
    INTO v_exists
    FROM zones
    WHERE idZone = p_idZone;

    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La zona no existe';
    END IF;

    UPDATE zones
    SET is_active = p_is_active
    WHERE idZone = p_idZone;

    SELECT
        idZone,
        name,
        description,
        is_active,
        created_at
    FROM zones
    WHERE idZone = p_idZone;
END$$

CREATE PROCEDURE sp_zones_get_all(
    IN p_only_active TINYINT
)
BEGIN
    SELECT
        idZone,
        name,
        description,
        is_active,
        created_at
    FROM zones
    WHERE p_only_active = 0 OR is_active = 1
    ORDER BY name ASC;
END$$

CREATE PROCEDURE sp_zones_get_by_id(
    IN p_idZone INT
)
BEGIN
    SELECT
        idZone,
        name,
        description,
        is_active,
        created_at
    FROM zones
    WHERE idZone = p_idZone;
END$$

DELIMITER ;