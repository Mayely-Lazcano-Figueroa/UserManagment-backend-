import { Router } from "express";
import {
  generateTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
} from "./twoFactor.controller";

const router = Router();

/**
 * Estas rutas requieren autenticación previa (req.user.id o similar).
 * Si tu middleware se llama `authMiddleware`, lo importamos y usamos aquí.
 * Por ahora las dejo sin proteger; tú puedes añadir el middleware luego.
 */

// Generar QR y secret temporal
router.post("/generate", generateTwoFactor);

// Verificar token y habilitar 2FA
router.post("/verify", verifyTwoFactor);

// Deshabilitar 2FA
router.post("/disable", disableTwoFactor);

export default router;
