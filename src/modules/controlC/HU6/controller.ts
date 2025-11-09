import { Request, Response } from "express";
import { SesionActiva } from "./models/SesionActiva";

// Crear nueva sesión
export const crearSesion = async (req: Request, res: Response): Promise<void> => {
  const { usuarioId, tipo_dispositivo, ubicacion } = req.body;

  try {
    const nuevaSesion = new SesionActiva({ usuarioId, tipo_dispositivo, ubicacion });
    await nuevaSesion.save();
    res.status(201).json({ mensaje: "Sesión registrada correctamente", nuevaSesion });
  } catch (error) {
    console.error("Error al registrar sesión:", error);
    res.status(500).json({ error: "Error al registrar sesión" });
  }
};

// Obtener todas las sesiones de un usuario
export const obtenerSesiones = async (req: Request, res: Response): Promise<void> => {
  try {
    const sesiones = await SesionActiva.find({ usuarioId: req.params.usuarioId });
    res.json(sesiones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener sesiones" });
  }
};

// Eliminar una sesión
export const eliminarSesion = async (req: Request, res: Response): Promise<void> => {
  try {
    await SesionActiva.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Sesión cerrada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar sesión" });
  }
};

// Eliminar todas las sesiones de un usuario
export const eliminarTodasSesiones = async (req: Request, res: Response): Promise<void> => {
  try {
    await SesionActiva.deleteMany({ usuarioId: req.params.usuarioId });
    res.json({ mensaje: "Todas las sesiones cerradas" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar sesiones" });
  }
};
