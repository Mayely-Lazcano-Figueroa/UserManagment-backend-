import { Request, Response } from 'express';
import Device from '../../../models/usermanagement/device.model';

// Registrar un dispositivo
export const registrarDispositivo = async (req: Request, res: Response) => {
  try {
    const { userId, os, type } = req.body;
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (!userId || !os || !type) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // Crear siempre un nuevo registro
    const dispositivo = new Device({
      userId,
      os,
      type,
      userAgent,
      lastLogin: new Date(),
    });

    await dispositivo.save();
    res.json({ message: 'Dispositivo registrado', dispositivo });
  } catch (err) {
    console.error('Error registrarDispositivo:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener dispositivos de un usuario
export const obtenerDispositivos = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const dispositivos = await Device.find({ userId }).sort({ lastLogin: -1 }); // orden descendente
    res.json(dispositivos);
  } catch (err) {
    console.error('Error obtenerDispositivos:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar todas las sesiones excepto la actual
export const eliminarTodasExceptoActual = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { except } = req.body;

    if (!userId) return res.status(400).json({ message: "Falta userId" });

    await Device.deleteMany({
      userId,
      _id: { $ne: except },
    });

    res.json({ message: "Todas las sesiones eliminadas excepto la actual" });
  } catch (err) {
    console.error('Error eliminarTodasExceptoActual:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar un dispositivo específico
export const eliminarDispositivo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Device.findByIdAndDelete(id);
    res.json({ message: 'Dispositivo eliminado' });
  } catch (err) {
    console.error('Error eliminarDispositivo:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
