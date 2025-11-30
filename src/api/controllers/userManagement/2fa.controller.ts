// src/modules/controlC/security/2fa/controller.ts
import { Request, Response } from 'express';
import {
  generateSecret, buildOtpAuth, makeQrDataUrl,
  saveTempSecretForUser, getTempSecretForUser,
  verifyToken, activateTwoFactorForUser, genRecoveryCodes, disableTwoFactorForUser
} from '../../../services/userManagement/2fa.service';

export async function generate(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user?.id) return res.status(401).json({ message: 'No autorizado' });

  const secret = generateSecret();
  const otpauth = buildOtpAuth(secret, user.email || user.name || `user-${user.id}`);
  const qrDataUrl = await makeQrDataUrl(otpauth);

  await saveTempSecretForUser(user.id, secret);
  return res.json({ qrDataUrl, issuer: process.env.TOTP_ISSUER || 'Servineo' });
}

export async function verify(req: Request, res: Response) {
  const user = (req as any).user;
  const { token } = req.body;
  if (!user?.id) return res.status(401).json({ message: 'No autorizado' });
  if (!token) return res.status(400).json({ message: 'token requerido' });

  const secret = await getTempSecretForUser(user.id);
  if (!secret) return res.status(400).json({ message: 'No hay un secreto pendiente' });

  const ok = verifyToken(secret, token);
  if (!ok) return res.status(400).json({ message: 'Token inválido' });

  const codes = genRecoveryCodes(8);
  await activateTwoFactorForUser(user.id, secret, codes);
  return res.json({ recoveryCodes: codes });
}

export async function disable(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user?.id) return res.status(401).json({ message: 'No autorizado' });

  // aquí idealmente validar contraseña o TOTP antes de desactivar — simplifico por ahora
  await disableTwoFactorForUser(user.id);
  return res.json({ ok: true });
}
