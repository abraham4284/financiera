import { Router } from "express";
import { register, login, logout,refresh,me } from "../controllers/auth.controller.js";
import { requireAuth } from "@/middlewares/requireAuth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/me", me);
router.post("/logout", requireAuth, logout);

export default router;
