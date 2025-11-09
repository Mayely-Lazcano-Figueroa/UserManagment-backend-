// src/modules/auth/twoFactor/twoFactor.controller.ts
import { Request, Response } from "express";
import { connectDB } from "../../../config/db/mongoClient";
import * as twoFactorService from "./twoFactor.service";

// 🔹 Generar código QR (inicio de la configuración)
export const generateTwoFactor = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id; // depende de tu middleware
    if (!userId) return res.status(401).json({ success: false, message: "No autorizado" });

    const data = await twoFactorService.generateTwoFactorSecret(userId);
    return res.json({
      success: true,
      message: "QR generado correctamente",
      qr: data.qrDataUrl,
    });
  } catch (error) {
    console.error("Error generando 2FA:", error);
    res.status(500).json({ success: false, message: "Error generando 2FA" });
  }
};

// 🔹 Verificar el código del usuario y habilitar 2FA
export const verifyTwoFactor = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { token } = req.body;
    if (!userId || !token) {
      return res.status(400).json({ success: false, message: "Datos incompletos" });
    }

    const result = await twoFactorService.verifyAndEnableTwoFactor(userId, token);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }

    return res.json({
      success: true,
      message: "Autenticador activado correctamente",
      backupCodes: result.backupCodes,
    });
  } catch (error) {
    console.error("Error verificando 2FA:", error);
    res.status(500).json({ success: false, message: "Error verificando 2FA" });
  }
};

// 🔹 Deshabilitar 2FA
export const disableTwoFactor = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { token } = req.body;
    if (!userId || !token) {
      return res.status(400).json({ success: false, message: "Datos incompletos" });
    }

    const result = await twoFactorService.disableTwoFactor(userId, token);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }

    return res.json({
      success: true,
      message: "Autenticador deshabilitado correctamente",
    });
  } catch (error) {
    console.error("Error deshabilitando 2FA:", error);
    res.status(500).json({ success: false, message: "Error deshabilitando 2FA" });
  }
};
