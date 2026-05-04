import { Router } from "express";
import { createLoanController } from "../controllers/loan.controllers.js";

const router = Router();

router.post("/loans", createLoanController);

export default router;