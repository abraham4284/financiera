import { Router } from "express";
import loansRoutes from "./loans/index.js";
import loanDetailsRoutes from "./loan_details/index.js"

const router = Router();

router.use(loansRoutes);
router.use(loanDetailsRoutes)

export default router;