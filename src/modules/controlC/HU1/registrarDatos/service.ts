import clientPromise from '../../config/mongodb';
import { ObjectId } from "mongodb";


interface ManualUser {
  email: string;
  name: string;
  password: string; // hasheada
}

// 🛑 Interfaz para el objeto que el servicio realmente devuelve
export interface InsertedUser {
  _id: ObjectId;       // ✅ Agregamos el ID que devuelve MongoDB
  name: string;
  email: string;
  password: string;
}

/**
 * 🔹 Verificar si el usuario ya existe
 */
export async function checkUserExists(email: string): Promise<boolean> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db('ServineoBD');
  const user = await db.collection('users').findOne({ email });
  return !!user;
}

export async function createManualUser(user: ManualUser): Promise<InsertedUser> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db('ServineoBD');

  const result = await db.collection('users').insertOne({
    name: user.name,
    email: user.email,
    password: user.password, // ya hasheada
    url_photo: '',
    role: 'requester',
    especialidad: '',
    telefono: '',
    certificacion: '',
    language: 'es',
    createdAt: new Date(),
  });

  console.log('✅ Usuario manual insertado en MongoDB:', user.email);

  return {
    _id: result.insertedId,
    name: user.name,
    email: user.email,
    password: user.password,
  };
}



