import { Request, Response } from 'express';
//./device.model
import Device from '../../../models/usermanagement/device.model';
 
// Registrar un dispositivo
export const registrarDispositivo = async (req: Request, res: Response) => {
  try {
    const { userId, os, type } = req.body;

    if (!userId || !os || !type) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // Si el usuario ya tiene este tipo de dispositivo, actualizar lastLogin
    let dispositivo = await Device.findOne({ userId, os, type });

    if (dispositivo) {
      dispositivo.lastLogin = new Date();
      await dispositivo.save();
      return res.json({ message: 'Dispositivo actualizado', dispositivo });
    }

    // Si no existe, crear nuevo
    dispositivo = new Device({ userId, os, type });
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
    const dispositivos = await Device.find({ userId });
    res.json(dispositivos);
  } catch (err) {
    console.error('Error obtenerDispositivos:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
// Eliminar todas las sesiones de un usuario excepto la actual
export const eliminarTodasExceptoActual = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { except } = req.body; // ID del dispositivo que no se elimina

    if (!userId) return res.status(400).json({ message: "Falta userId" });

    await Device.deleteMany({
      userId,
      _id: { $ne: except }, // elimina todos excepto el actual
    });

    res.json({ message: "Todas las sesiones eliminadas excepto la actual" });
  } catch (err) {
    console.error('Error eliminarTodasExceptoActual:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


// Eliminar dispositivo
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
