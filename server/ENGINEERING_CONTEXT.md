# 🧠 INSTRUCTIVO DEL SISTEMA — GENERAL_BOOK + LOANS

## 📌 Objetivo del sistema

Sistema financiero que permite:

- Gestión de clientes y empleados
- Administración de préstamos (múltiples modalidades)
- Registro de pagos y cálculo de deuda
- Contabilidad completa con partida doble (GL)
- Trazabilidad total entre operación y contabilidad

## 🧩 Arquitectura por módulos

```txt
Auth
People
Zones
Loans
Payments
Accounting (GL)
```

## 🔐 AUTH

### Tablas

- `users`
- `roles`
- `user_sessions`
- `user_actions`

### Responsabilidad

- autenticación
- autorización
- auditoría de acciones

## 👥 PEOPLE

### Tablas

- `clients`
- `employees`
- `contacts` (polimórfica)
- `addresses` (polimórfica)

### Reglas

```txt
contacts:
  entity_type = 'CLIENT' | 'EMPLOYEE'
  entity_id = idClient | idEmployee

addresses:
  igual lógica
```

## 📍 ZONES

### Tablas

- `zones`
- `zone_employee_assignments`

### Responsabilidad

- agrupar clientes por zona
- asignar cobradores a zonas

## 💰 LOANS (núcleo del negocio)

### Tablas

- `loans`
- `loan_details`
- `loan_guarantors`
- `loan_commissions`

### 🧾 `loans`

Representa el crédito.

Campos clave:

```txt
principal_original
principal_current
loan_type
installments_count
installment_amount
parent_loan_id
root_loan_id
status
```

### 🔗 Refinanciaciones

```txt
parent_loan_id → préstamo anterior
root_loan_id → préstamo original
```

Ejemplo:

```txt
1 (original)
  ↓
2 (refinancia 1)
  ↓
3 (refinancia 2)
```

### 📅 `loan_details`

Representa cuotas o períodos.

Contiene:

```txt
principal_due
interest_due
total_due

principal_paid
interest_paid
total_paid

balance_due
status
```

Es el estado acumulado de la cuota, no el detalle de pagos.

### 👥 `loan_guarantors`

```txt
idLoan
idGuarantorClient
```

Clientes que garantizan el préstamo.

### 💸 `loan_commissions`

```txt
idLoan
idEmployee
commission_amount
status
```

Empleados que generan comisión por el préstamo.

## 💳 PAYMENTS

### Tablas

- `loan_payments`
- `loan_payment_allocations`

### 💰 `loan_payments`

Representa el pago real.

```txt
idLoan
idAccount
amount
payment_date
```

### 🔁 `loan_payment_allocations`

Distribuye el pago.

```txt
idPayment
idLoanDetail
applied_to: INTEREST | PRINCIPAL | LATE_FEE
amount
```

### 🧠 Regla clave

```txt
loan_payments = dinero que entra
loan_payment_allocations = cómo se distribuye
loan_details = resultado acumulado
```

## 📊 ACCOUNTING (GL)

### Tablas

- `accounts`
- `gl_categories`
- `gl_transactions`
- `gl_transaction_lines`

### 📘 `accounts`

Representa cuentas contables:

```txt
Caja
Banco
Cartera de préstamos
Ingresos por intereses
```

### 🧾 `gl_transactions`

Cabecera del asiento.

```txt
source_module
source_id
```

Ejemplo:

```txt
source_module = 'LOAN'
source_id = idLoan
```

### 📒 `gl_transaction_lines`

Partida doble:

```txt
entry_type: DEBIT | CREDIT
amount
idAccount
```

### ⚖️ Regla obligatoria

```txt
SUM(DEBIT) = SUM(CREDIT)
```

## 🔄 Flujo contable

### 🟢 1. Desembolso de préstamo

```txt
DEBIT  → Cartera de préstamos
CREDIT → Caja
```

No es ingreso ni gasto.

### 🟢 2. Pago de cuota

Ejemplo:

```txt
Pago: 35.000
Capital: 25.000
Interés: 10.000
```

```txt
DEBIT  → Caja
CREDIT → Cartera de préstamos (capital)
CREDIT → Ingresos por intereses
```

## ⚠️ Reglas importantes

### ❌ NO registrar desde Accounting

No permitir manualmente:

- préstamos
- pagos
- refinanciaciones

### ✔ SÍ registrar desde Accounting

- gastos
- transferencias
- ajustes

## 🔗 Integración entre módulos

```txt
Loans → genera GL automáticamente
Payments → genera GL automáticamente
Accounting → solo operaciones manuales
```

## 🧠 Reglas de negocio

### 💡 Regla de imputación de pagos

Orden recomendado:

```txt
1. INTEREST
2. LATE_FEE
3. PRINCIPAL
```

### 💡 Capital

```txt
principal_current = capital pendiente
```

Se reduce solo cuando se paga capital.

### 💡 Interés

- no afecta capital
- se reconoce como ingreso al cobrarse

## 🧠 Decisiones clave del diseño

### ✔ Separación clara

```txt
Operativo ≠ Contable
```

### ✔ Trazabilidad total

```txt
loan → payment → allocation → GL
```

### ✔ Modelo extensible

Permite:

- mensual libre
- semanal
- refinanciaciones infinitas
- pagos parciales
- pagos excedentes

## 🚀 Objetivo de este diseño

Permitir:

- lógica financiera compleja
- auditoría completa
- reportes contables reales
- escalabilidad

## 🧠 Resumen final

```txt
loans → define el crédito
loan_details → define la deuda
loan_payments → registra el pago
loan_payment_allocations → distribuye el pago
gl_transactions → refleja impacto contable
```

## 🎯 Para IA / dev

Este sistema requiere:

- lógica de negocio fuerte en backend
- transacciones SQL (BEGIN / COMMIT)
- consistencia entre módulos
- validaciones estrictas

