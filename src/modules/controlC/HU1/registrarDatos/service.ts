import clientPromise from '../../config/mongodb';
import { ObjectId } from 'mongodb';
interface ManualUser {
  
  email: string;
  name: string;
  password: string; // hasheada
}

// 🛑 Interfaz para el objeto que el servicio realmente devuelve
interface InsertedUser {
  id: string;
  email: string;
  name: string;
  // No incluir la contraseña hasheada aquí
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

/**
 * 🔹 Crear usuario manual
 */
/*
export async function createManualUser(user: ManualUser): Promise<InsertedUser> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db('ServineoBD'); // Se inserta el documento completo con todos los campos
  await db.collection('users').insertOne({
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
  });*/
  export async function createManualUser(user: ManualUser): Promise<InsertedUser> {
    const mongoClient = await clientPromise;
    const db = mongoClient.db('ServineoBD');
    
    // Guardamos el resultado de la inserción
    const result = await db.collection('users').insertOne({
      name: user.name,
      email: user.email,
      password: user.password,
      url_photo: '',
      role: 'requester',
      especialidad: '',
      telefono: '',
      certificacion: '',
      language: 'es',
      createdAt: new Date(),
    });
  console.log('✅ Usuario manual insertado en MongoDB:', user.email);
  // 🛑 CORRECCIÓN CLAVE: Devolver solo los datos relevantes (sin la contraseña hasheada)
  /*
  return {
    name: user.name,
    email: user.email,
  };
}*/
return {
  id: result.insertedId.toString(), // Convertir ObjectId a string
  name: user.name,
  email: user.email,
};
}
