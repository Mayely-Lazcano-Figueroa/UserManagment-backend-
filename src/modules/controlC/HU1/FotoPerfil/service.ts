// src/modules/controlC/HU1/usuario/service.ts
import clientPromise from '../../config/mongodb'; // Usa tu cliente de MongoDB
import { ObjectId } from 'mongodb';

/**
 * 🔹 Actualiza el campo url_photo en la colección 'users'.
 */
export async function updatePhotoUrl(userId: string, photoUrl: string) {
  const mongoClient = await clientPromise;
  const db = mongoClient.db('ServineoBD');

  // Realiza la actualización
  const result = await db.collection('users').updateOne(
    { _id: new ObjectId(userId) }, // Buscar por ID
    { $set: { url_photo: photoUrl } }, // Actualizar el campo
  );

  return result;
}
