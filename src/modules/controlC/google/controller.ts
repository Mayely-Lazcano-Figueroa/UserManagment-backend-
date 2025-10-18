import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyGoogleToken, checkUserExists, createUser } from "./service";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

export async function googleAuth(req: Request, res: Response) {
  const { token, modo } = req.body; // 👈 añadimos 'modo'

  if (!token) {
    return res.status(400).json({ status: "error", message: "Token no recibido" });
  }

  try {
    const user = await verifyGoogleToken(token);
    if (!user || !user.email) {
      return res.status(400).json({ status: "error", message: "Token inválido" });
    }

    const exists = await checkUserExists(user.email);

    // 👇 si no existe y está en modo login, error (no lo crea)
    if (!exists) {
      if (modo === "login") {
        return res
          .status(404)
          .json({ status: "error", message: "Usuario no registrado" });
      }
      await createUser(user); // solo crea si es registro
    }

    const sessionToken = jwt.sign(
      { email: user.email, name: user.name },
      process.env.JWT_SECRET || "super_secret_key",
      { expiresIn: "7d" }
    );

    return res.json({
      status: "success",
      user,
      token: sessionToken,
    });
  } catch (error) {
    console.error("❌ Error al autenticar con Google:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Error al autenticar con Google" });
  }
}

export function verifyJWT(req: Request, res: Response, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ message: "Token no proporcionado" });

  const token = authHeader.split(" ")[1];
  const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}
