import { Router } from "express";
import loansRoutes from "./loans/index.js";

const router = Router();

router.use(loansRoutes);


export default router;