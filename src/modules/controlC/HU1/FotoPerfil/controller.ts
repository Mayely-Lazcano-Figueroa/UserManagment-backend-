// src/modules/controlC/HU1/usuario/controller.ts
import { Request, Response } from 'express';
// 💡 DEBES CREAR ESTA FUNCIÓN DEL SERVICIO EN EL PASO 3
import { updatePhotoUrl } from './service';
import { ObjectId } from 'mongodb';

/**
 * 🔹 Actualiza la URL de la foto de perfil de un usuario.
 */
export async function updateProfilePhoto(req: Request, res: Response) {
  // El frontend envía usuarioId y fotoPerfil
  const { usuarioId, fotoPerfil } = req.body;

  // 1. Validar campos
  if (!usuarioId || !fotoPerfil) {
    return res
      .status(400)
      .json({ success: false, message: 'Faltan datos (ID de usuario o URL de foto).' });
  }

  // 2. Validar ID de MongoDB
  if (!ObjectId.isValid(usuarioId)) {
    return res.status(400).json({ success: false, message: 'ID de usuario inválido.' });
  }

  try {
    // 3. Llamar al servicio para actualizar en MongoDB
    const result = await updatePhotoUrl(usuarioId, fotoPerfil);

    if (result.modifiedCount === 0) {
      // Si modifiedCount es 0, puede ser que el usuario no exista
      return res
        .status(404)
        .json({ success: false, message: 'Usuario no encontrado o foto sin cambios.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Foto de perfil actualizada correctamente.',
    });
  } catch (error) {
    console.error('🛑 ERROR al actualizar foto:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error interno del servidor al actualizar la foto.' });
  }
}
