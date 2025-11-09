// src/modules/auth/twoFactor/twoFactor.service.ts
import { MongoClient, ObjectId } from "mongodb";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

/**
 * Conexión simple con cacheo para evitar reconexiones en dev.
 * Usa MONGODB_URI y DB_NAME desde .env (ya los tenías).
 */
const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = process.env.DB_NAME || "ServineoBD";

if (!MONGO_URI) {
  throw new Error("MONGODB_URI no está definido en las env vars");
}

let cachedClient: MongoClient | null = null;
async function getClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(MONGO_URI, { });
  await client.connect();
  cachedClient = client;
  return client;
}

async function usersCollection() {
  const client = await getClient();
  const db = client.db(DB_NAME);
  return db.collection("users"); // ajusta el nombre si tu colección se llama otra cosa
}

/* ------------------ Funciones 2FA ------------------ */

export async function generateTwoFactorSecret(userId: string) {
  const secret = speakeasy.generateSecret({
    name: `Servineo (${process.env.APP_NAME || "Servineo"})`,
    length: 20,
  });

  const usersCol = await usersCollection();
  await usersCol.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { "twoFactor.tempSecret": secret.base32 } }
  );

  const otpauthUrl = secret.otpauth_url!;
  const qrDataUrl = await qrcode.toDataURL(otpauthUrl);

  // En producción devolver solo qrDataUrl por seguridad
  return { qrDataUrl, base32: secret.base32 };
}

export async function verifyAndEnableTwoFactor(userId: string, token: string) {
  const usersCol = await usersCollection();
  const user = await usersCol.findOne({ _id: new ObjectId(userId) });

  const tempSecret = user?.twoFactor?.tempSecret;
  if (!tempSecret) return { success: false, error: "No hay secret temporal. Genera uno primero." };

  const verified = speakeasy.totp.verify({
    secret: tempSecret,
    encoding: "base32",
    token,
    window: 1,
  });

  if (!verified) return { success: false, error: "Código inválido" };

  // Generar backup codes (8 códigos)
  const backupCodes = Array.from({ length: 8 }).map(() =>
    Math.random().toString(36).slice(2, 10).toUpperCase()
  );

  const backupDocs = backupCodes.map((c) => ({ code: c, used: false }));

  await usersCol.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        "twoFactor.secret": tempSecret,
        "twoFactor.enabled": true,
        "twoFactor.backupCodes": backupDocs,
      },
      $unset: { "twoFactor.tempSecret": "" },
    }
  );

  return { success: true, backupCodes };
}

export async function disableTwoFactor(userId: string, token: string) {
  const usersCol = await usersCollection();
  const user = await usersCol.findOne({ _id: new ObjectId(userId) });

  const secret = user?.twoFactor?.secret;
  if (!secret) return { success: false, error: "2FA no está habilitado" };

  const verified = speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  });

  if (!verified) return { success: false, error: "Código inválido" };

  await usersCol.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { "twoFactor.enabled": false }, $unset: { "twoFactor.secret": "", "twoFactor.backupCodes": "" } }
  );

  return { success: true };
}

export function verifyOtp(secret: string, token: string) {
  if (!secret) return false;
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  });
}

export async function consumeBackupCode(userId: string, code: string) {
  const usersCol = await usersCollection();
  const user = await usersCol.findOne({ _id: new ObjectId(userId) });
  const codes: Array<{ code: string; used: boolean }> = user?.twoFactor?.backupCodes ?? [];

  const matchIndex = codes.findIndex((c) => c.code === code && !c.used);
  if (matchIndex === -1) return { success: false, error: "Backup code inválido o usado" };

  codes[matchIndex].used = true;
  await usersCol.updateOne({ _id: new ObjectId(userId) }, { $set: { "twoFactor.backupCodes": codes } });

  return { success: true };
}
