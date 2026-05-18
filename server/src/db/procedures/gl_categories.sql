DROP PROCEDURE IF EXISTS sp_gl_categories_create;
DROP PROCEDURE IF EXISTS sp_gl_categories_update;
DROP PROCEDURE IF EXISTS sp_gl_categories_toggle_status;
DROP PROCEDURE IF EXISTS sp_gl_categories_get_all;
DROP PROCEDURE IF EXISTS sp_gl_categories_get_by_id;

DELIMITER $$

CREATE PROCEDURE sp_gl_categories_create(
    IN p_name VARCHAR(120),
    IN p_description VARCHAR(255),
    IN p_nature ENUM('INCOME','EXPENSE'),
    OUT p_idGlCategorie INT
)
BEGIN
    IF p_name IS NULL OR TRIM(p_name) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre de la categoría es obligatorio';
    END IF;

    INSERT INTO gl_categories (
        name,
        description,
        nature,
        is_system,
        is_active,
        created_at
    ) VALUES (
        TRIM(p_name),
        p_description,
        p_nature,
        0,
        1,
        NOW()
    );

    SET p_idGlCategorie = LAST_INSERT_ID();

    SELECT * FROM gl_categories WHERE idGlCategorie = p_idGlCategorie;
END$$


CREATE PROCEDURE sp_gl_categories_update(
    IN p_idGlCategorie INT,
    IN p_name VARCHAR(120),
    IN p_description VARCHAR(255),
    IN p_nature ENUM('INCOME','EXPENSE')
)
BEGIN
    DECLARE v_exists INT DEFAULT 0;
    DECLARE v_is_system TINYINT DEFAULT 0;

    SELECT COUNT(*), COALESCE(MAX(is_system), 0)
    INTO v_exists, v_is_system
    FROM gl_categories
    WHERE idGlCategorie = p_idGlCategorie;

    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La categoría no existe';
    END IF;

    IF p_idGlCategorie <= 3 OR v_is_system = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede editar una categoría protegida del sistema';
    END IF;

    UPDATE gl_categories
    SET
        name = TRIM(p_name),
        description = p_description,
        nature = p_nature
    WHERE idGlCategorie = p_idGlCategorie;

    SELECT * FROM gl_categories WHERE idGlCategorie = p_idGlCategorie;
END$$


CREATE PROCEDURE sp_gl_categories_toggle_status(
    IN p_idGlCategorie INT,
    IN p_is_active TINYINT
)
BEGIN
    DECLARE v_exists INT DEFAULT 0;
    DECLARE v_is_system TINYINT DEFAULT 0;

    SELECT COUNT(*), COALESCE(MAX(is_system), 0)
    INTO v_exists, v_is_system
    FROM gl_categories
    WHERE idGlCategorie = p_idGlCategorie;

    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La categoría no existe';
    END IF;

    IF p_idGlCategorie <= 3 OR v_is_system = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede desactivar una categoría protegida del sistema';
    END IF;

    UPDATE gl_categories
    SET is_active = p_is_active
    WHERE idGlCategorie = p_idGlCategorie;

    SELECT * FROM gl_categories WHERE idGlCategorie = p_idGlCategorie;
END$$


CREATE PROCEDURE sp_gl_categories_get_all(
    IN p_only_active TINYINT
)
BEGIN
    SELECT
        idGlCategorie,
        name,
        description,
        nature,
        is_system,
        is_active,
        created_at
    FROM gl_categories
    WHERE (p_only_active = 0 OR is_active = 1)
      AND idGlCategorie NOT IN (1,2,3)
      AND LOWER(name) NOT IN ('transfer', 'adjustment', 'other')
      AND is_system = 0
    ORDER BY name ASC;
END$$


CREATE PROCEDURE sp_gl_categories_get_by_id(
    IN p_idGlCategorie INT
)
BEGIN
    SELECT
        idGlCategorie,
        name,
        description,
        nature,
        is_system,
        is_active,
        created_at
    FROM gl_categories
    WHERE idGlCategorie = p_idGlCategorie
      AND idGlCategorie NOT IN (1,2,3)
      AND LOWER(name) NOT IN ('transfer', 'adjustment', 'other')
      AND is_system = 0;
END$$

DELIMITER ;

CREATE PROCEDURE sp_gl_categories_get_by_nature(
    IN p_nature ENUM('INCOME', 'EXPENSE', 'ADJUSTMENT', 'TRANSFER', 'OTHER')
)
BEGIN
    SELECT
        idGlCategorie,
        name,
        description,
        nature,
        is_system,
        is_active,
        created_at
    FROM gl_categories glc
    WHERE LOWER(glc.nature) = LOWER(p_nature)
    AND glc.is_system = 1;
END$$

DELIMITER ;