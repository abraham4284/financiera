import { Router } from "express";
import glTransactionsRoutes from "./gl_transactions/index.js";

const router = Router();

router.use(glTransactionsRoutes);


export default router;