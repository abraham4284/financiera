DROP PROCEDURE IF EXISTS sp_create_user_session;
DELIMITER $$

CREATE PROCEDURE sp_create_user_session(
  IN p_refresh_token_hash VARCHAR(255),
  IN p_expires_at DATETIME,
  IN p_user_agent VARCHAR(255),
  IN p_ip VARCHAR(45),
  IN p_idUser INT
)
BEGIN
  -- Validación básica
  IF p_refresh_token_hash IS NULL OR LENGTH(TRIM(p_refresh_token_hash)) = 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'refresh_token_hash es obligatorio';
  END IF;

  IF p_expires_at IS NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'expires_at es obligatorio';
  END IF;

  IF p_idUser IS NULL OR p_idUser <= 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'idUser inválido';
  END IF;

  -- Insert
  INSERT INTO user_sessions
    (refresh_token_hash, created_at, expires_at, revoked_at, last_used_at, user_agent, ip, idUser)
  VALUES
    (p_refresh_token_hash, NOW(), p_expires_at, NULL, NULL, p_user_agent, p_ip, p_idUser);

  -- Devolver el idLogin generado
  SELECT LAST_INSERT_ID() AS idLogin;
END$$

DELIMITER ;



DROP PROCEDURE IF EXISTS sp_create_user;
DELIMITER $$

CREATE PROCEDURE sp_create_user(
  IN p_username VARCHAR(300),
  IN p_password VARCHAR(3000),
  IN p_img_url VARCHAR(3000),
  IN p_idRole INT
)
BEGIN
  -- Insert
  INSERT INTO users (username,password,img_url,idRole) VALUES (p_username, p_password,p_img_url,p_idRole);

  -- Devolver el idLogin generado
  SELECT LAST_INSERT_ID() AS idUser;
END$$

DELIMITER ;


DROP PROCEDURE IF EXISTS sp_user_actions_create;

DELIMITER $$

CREATE PROCEDURE sp_user_actions_create(
    IN p_action TEXT,
    IN p_method VARCHAR(45),
    IN p_ip TEXT,
    IN p_user_agent TEXT,
    IN p_idUser INT
)
BEGIN
    INSERT INTO user_actions (
        action,
        method,
        date,
        ip,
        user_agent,
        idUser
    ) VALUES (
        p_action,
        p_method,
        NOW(),
        p_ip,
        p_user_agent,
        p_idUser
    );
END$$

DELIMITER ;