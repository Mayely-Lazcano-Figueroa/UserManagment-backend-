import clientPromise from "../../../config/mongodb";
import { ObjectId } from "mongodb";

export const guardarUbicacionUsuario = async (usuarioId: string, lat: number, lng: number) => {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("ServineoBD");

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(usuarioId) },
    { $set: { ubicacion: { lat, lng }, updatedAt: new Date() } }
  );

  console.log(`📍 Ubicación guardada para usuario ${usuarioId}: [${lat}, ${lng}]`);
  return result;
};

