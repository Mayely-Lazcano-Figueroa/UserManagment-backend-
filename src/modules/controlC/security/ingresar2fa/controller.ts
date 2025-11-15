// src/modules/controlC/security/ingresar2fa/controller.ts
import { Request, Response } from 'express';
import { verifyTOTPForEmail } from './service';

export async function verifyTOTPController(req: Request, res: Response) {
  console.log("[DEBUG] verifyTOTPController iniciado, body:", req.body);

  try {
    const { email, code } = req.body;
    console.log("[DEBUG] Email y código recibidos:", email, code);

    const result = await verifyTOTPForEmail(email, code);
    console.log("[DEBUG] Resultado verifyTOTPForEmail:", result);

    if (!result.ok) {
      return res.status(400).json({
        success: false,
        message: result.message,
        reason: result.reason
      });
    }

    return res.json({
      success: true,
      data: {
        token: result.token,
        user: result.user,
        failedAttempts: result.failedAttempts ?? 0,
        twoFactorConfigured: true,
        twoFactorConfiguredAt: result.twoFactorConfiguredAt
      }
    });
  } catch (err) {
    console.error("[DEBUG] Error en verifyTOTPController:", err);
    return res.status(500).json({ success: false, message: 'Error en servidor' });
  }
}