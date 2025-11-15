// src/modules/controlC/security/ingresar2fa/service.ts

import { authenticator } from 'otplib';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import clientPromise from '../../config/mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || "servineo_super_secret_key";
const TOKEN_EXPIRES = "2h";

const ENC_KEY_HEX = process.env.TOTP_ENC_KEY || ""; // misma clave usada en tu módulo 2FA
const ENC_KEY = Buffer.from(ENC_KEY_HEX, "hex");
const ALGO = "aes-256-gcm";

function decryptSecret(packed: string) {
  const { ct, iv, tag } = JSON.parse(packed);
  const decipher = crypto.createDecipheriv(ALGO, ENC_KEY, Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));

  const pt = Buffer.concat([
    decipher.update(Buffer.from(ct, 'base64')),
    decipher.final(),
  ]);

  return pt.toString("utf8");
}

export async function verifyTOTPForEmail(email: string, token: string) {
  try {
    console.log("[DEBUG] verifyTOTPForEmail iniciado con email:", email, "y token:", token);
    const mongo = await clientPromise;
    const db = mongo.db("ServineoBD");

    const user = await db.collection("users").findOne({ email });
    console.log("[DEBUG] Usuario encontrado:", user);

    if (!user) {
      console.log("[DEBUG] Usuario no encontrado");
      return { ok: false, message: "Usuario no encontrado", reason: "not_found" };
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      console.log("[DEBUG] Usuario no tiene 2FA activo");
      return { ok: false, message: "El usuario no tiene 2FA activo", reason: "no_2fa" };
    }

    let secretPlain;
    try {
      secretPlain = decryptSecret(user.twoFactorSecret);
      console.log("[DEBUG] Secret desencriptado:", secretPlain);
    } catch (err) {
      console.error("[DEBUG] Error desencriptando secret:", err);
      return { ok: false, message: "Error al desencriptar el secreto 2FA", reason: "decrypt_fail" };
    }

    const isValid = authenticator.check(token, secretPlain);
    console.log("[DEBUG] Código válido?:", isValid);

    if (!isValid) {
      await db.collection("users").updateOne({ _id: user._id }, { $inc: { failedAttempts: 1 } });
      console.log("[DEBUG] Código incorrecto, incrementando failedAttempts");
      return { ok: false, message: "Código incorrecto", reason: "invalid_code" };
    }

    const now = new Date();
    await db.collection("users").updateOne({ _id: user._id }, { $set: { failedAttempts: 0, twoFactorVerifiedAt: now } });
    console.log("[DEBUG] Código correcto, reset failedAttempts y guardada twoFactorVerifiedAt:", now);

    const jwtToken = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES }
    );
    console.log("[DEBUG] JWT generado:", jwtToken);

    return {
      ok: true,
      token: jwtToken,
      user: { _id: user._id.toString(), email: user.email, name: user.name, picture: user.picture ?? null },
      failedAttempts: 0,
      twoFactorConfigured: true,
      twoFactorConfiguredAt: now.toISOString()
    };

  } catch (err) {
    console.error("❌ Error en verifyTOTPForEmail:", err);
    return { ok: false, message: "Error interno del servidor", reason: "server_error" };
  }
}


