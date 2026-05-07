DROP PROCEDURE IF EXISTS sp_loan_renewals_create;

DELIMITER $$

CREATE PROCEDURE sp_loan_renewals_create(
    IN p_idLoans INT,
    IN p_currentLoanDetailId INT,
    IN p_newPrincipal DECIMAL(18,2),
    IN p_newInterestRate DECIMAL(18,2),
    IN p_newTotalDue DECIMAL(18,2),
    IN p_newDueDate DATE,
    IN p_notes VARCHAR(255),
    OUT p_idNewLoanDetail INT
)
BEGIN
    DECLARE v_loan_exists INT DEFAULT 0;
    DECLARE v_loan_type VARCHAR(50);
    DECLARE v_current_detail_exists INT DEFAULT 0;
    DECLARE v_interest_due DECIMAL(18,2);
    DECLARE v_interest_paid DECIMAL(18,2);
    DECLARE v_new_interest_due DECIMAL(18,2);
    DECLARE v_next_installment_number INT;
    DECLARE v_previous_principal DECIMAL(18,2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    IF p_newPrincipal <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nuevo capital debe ser mayor a 0';
    END IF;

    IF p_newTotalDue <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nuevo total debe ser mayor a 0';
    END IF;

    START TRANSACTION;

    SELECT COUNT(*), MAX(loan_type), MAX(principal_current)
    INTO v_loan_exists, v_loan_type, v_previous_principal
    FROM loans
    WHERE idLoans = p_idLoans
      AND status = 'ACTIVE';

    IF v_loan_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El préstamo no existe o no está activo';
    END IF;

    IF v_loan_type <> 'MENSUAL_LIBRE' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Solo se pueden renovar préstamos de tipo MENSUAL_LIBRE';
    END IF;

    SELECT
        COUNT(*),
        COALESCE(MAX(interest_due), 0),
        COALESCE(MAX(interest_paid), 0)
    INTO
        v_current_detail_exists,
        v_interest_due,
        v_interest_paid
    FROM loan_details
    WHERE idLoanDetail = p_currentLoanDetailId
      AND idLoans = p_idLoans
      AND status IN ('PENDING','PARTIAL','OVERDUE');

    IF v_current_detail_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El período actual no existe o no está pendiente';
    END IF;

    IF v_interest_paid < v_interest_due THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede renovar: el interés actual no está cubierto';
    END IF;

    IF p_newPrincipal > v_previous_principal THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nuevo capital no puede ser mayor al capital actual';
    END IF;

    SET v_new_interest_due = ROUND(p_newPrincipal * p_newInterestRate / 100, 2);

    IF p_newTotalDue <> (p_newPrincipal + v_new_interest_due) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El total proyectado no coincide con capital + interés';
    END IF;

    SELECT COALESCE(MAX(installment_number), 0) + 1
    INTO v_next_installment_number
    FROM loan_details
    WHERE idLoans = p_idLoans;

   UPDATE loan_details
SET
    status = 'SETTLED',
    balance_due = 0,
    notes = CONCAT(
        COALESCE(notes, ''),
        ' | Liquidado por renovación mensual libre: ',
        COALESCE(p_notes, 'Sin observaciones')
    )
WHERE idLoanDetail = p_currentLoanDetailId
  AND idLoans = p_idLoans;

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
        v_next_installment_number,
        p_newDueDate,
        p_newPrincipal,
        v_new_interest_due,
        0,
        p_newTotalDue,
        0,
        0,
        0,
        0,
        0,
        p_newTotalDue,
        'PENDING',
        p_newPrincipal,
        p_notes,
        NOW(),
        p_idLoans
    );

    SET p_idNewLoanDetail = LAST_INSERT_ID();

    UPDATE loans
    SET
        principal_current = p_newPrincipal,
        installment_amount = p_newTotalDue,
        maturity_date = p_newDueDate,
        notes = CONCAT(
            COALESCE(notes, ''),
            ' | Renovación mensual libre: nuevo capital ',
            p_newPrincipal,
            ', nuevo total ',
            p_newTotalDue,
            ', vencimiento ',
            p_newDueDate,
            '. ',
            COALESCE(p_notes, '')
        )
    WHERE idLoans = p_idLoans;

    COMMIT;
END$$