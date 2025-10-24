import { Request, Response } from "express";
import { guardarUbicacionUsuario } from "./service";
import { ObjectId } from "mongodb";

export const registrarUbicacion = async (req: Request, res: Response) => {
  const { usuarioId, lat, lng } = req.body;

  // Validación de campos
  if (!usuarioId || lat === undefined || lng === undefined) {
    return res.status(400).json({ success: false, message: "Faltan datos: usuarioId, lat o lng." });
  }

  // Validar formato del ID
  if (!ObjectId.isValid(usuarioId)) {
    return res.status(400).json({ success: false, message: "ID de usuario inválido." });
  }

  try {
    const result = await guardarUbicacionUsuario(usuarioId, lat, lng);

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado o ubicación sin cambios." });
    }

    return res.status(200).json({
      success: true,
      message: "Ubicación registrada correctamente",
      ubicacion: { lat, lng },
    });
  } catch (error) {
    console.error("❌ Error guardando ubicación:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
};
