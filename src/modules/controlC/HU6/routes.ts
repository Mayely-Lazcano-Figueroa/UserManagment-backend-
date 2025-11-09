import express, { Request, Response } from "express";
import { SesionActiva } from "./models/SesionActiva";

const router = express.Router();

// ✅ Obtener sesiones activas de un usuario
router.get("/:usuarioId", async (req: Request, res: Response): Promise<void> => {
  try {
    const sesiones = await SesionActiva.find({ usuarioId: req.params.usuarioId });
    res.json(sesiones);
  } catch (error) {
    console.error("Error al obtener sesiones:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ✅ Cerrar sesión en un solo dispositivo
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await SesionActiva.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error("Error al eliminar sesión:", error);
    res.status(500).json({ error: "Error al eliminar sesión" });
  }
});

// ✅ Cerrar todas las sesiones de un usuario
router.delete("/usuario/:usuarioId", async (req: Request, res: Response): Promise<void> => {
  try {
    await SesionActiva.deleteMany({ usuarioId: req.params.usuarioId });
    res.json({ mensaje: "Todas las sesiones cerradas" });
  } catch (error) {
    console.error("Error al eliminar sesiones:", error);
    res.status(500).json({ error: "Error al eliminar sesiones" });
  }
});

export default router;
router.post("/", async (req: Request, res: Response): Promise<void> => {
    const { usuarioId, tipo_dispositivo, ubicacion } = req.body;
    try {
      const nuevaSesion = new SesionActiva({ usuarioId, tipo_dispositivo, ubicacion });
      await nuevaSesion.save();
      res.status(201).json({ mensaje: "Sesión registrada" });
    } catch (error) {
      res.status(500).json({ error: "Error al registrar sesión" });
    }
  });
  