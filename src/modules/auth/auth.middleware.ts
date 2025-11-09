// src/modules/auth/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

interface JwtPayloadLike {
  id?: string;
  sub?: string;
  userId?: string;
  email?: string;
  name?: string;
  [k: string]: any;
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = String(req.headers.authorization || "");
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: "No autorizado: falta token" });
    }

    let payload: JwtPayloadLike;
    try {
      payload = jwt.verify(token, JWT_SECRET) as JwtPayloadLike;
    } catch (err) {
      return res.status(401).json({ success: false, message: "Token inválido o expirado" });
    }

    const userId = payload?.id || payload?.userId || payload?.sub || null;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Token válido pero sin id de usuario" });
    }

    (req as any).user = { id: String(userId), ...payload };
    next();
  } catch (error) {
    console.error("authMiddleware error:", error);
    return res.status(500).json({ success: false, message: "Error en autenticación" });
  }
}
