import { Request, Response } from 'express';
import Device from './device.model';

export const getDevices = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const devices = await Device.find({ userId });
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener dispositivos' });
  }
};

// Registrar un dispositivo (ej: al iniciar sesión)
export const registerDevice = async (req: Request, res: Response) => {
  try {
    const { userId, deviceId, type, browser, location } = req.body;

    const existing = await Device.findOne({ userId, deviceId });
    if (!existing) {
      await Device.create({ userId, deviceId, type, browser, location });
    } else {
      existing.lastActive = new Date();
      await existing.save();
    }

    res.status(200).json({ message: 'Dispositivo registrado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar dispositivo' });
  }
};

// Cerrar sesión (eliminar ese device)
export const logoutDevice = async (req: Request, res: Response) => {
  try {
    const { userId, deviceId } = req.body;
    await Device.deleteOne({ userId, deviceId });
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar sesión' });
  }
};

// Cerrar todas las sesiones excepto la actual
export const closeOtherSessions = async (req: Request, res: Response) => {
  try {
    const { userId, currentDeviceId } = req.body;
    await Device.deleteMany({ userId, deviceId: { $ne: currentDeviceId } });
    res.status(200).json({ message: 'Otras sesiones cerradas correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar otras sesiones' });
  }
};
