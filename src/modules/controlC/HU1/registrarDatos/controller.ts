// src/modules/controlC/HU1/registarDatos/controller.ts
/*
import { Request, Response } from 'express'; // 💡 res viene de aquí
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { checkUserExists, createManualUser } from './service';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';


// Asegúrate de que esta función envuelva todo el código de abajo
export async function manualRegister(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'Faltan datos' });

  try {
    // 2. Verificar existencia
    const exists = await checkUserExists(email);
    if (exists) return res.status(400).json({ success: false, message: 'El usuario ya existe' }); // 3. Hashear la contraseña

    const hashedPassword = await bcrypt.hash(password, 10); // 4. Crear usuario

    const newUser = await createManualUser({
      name,
      email,
      password: hashedPassword,
    }); // 5. Generar JWT

    const token = jwt.sign({ email: newUser.email, name: newUser.name }, JWT_SECRET, {
      expiresIn: '7d',
    }); // 6. Respuesta de éxito - Usando la variable `token`

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      user: { id: newUser.id, name: newUser.name, email: newUser.email }, // 💡 El ID ya está aquí
      token, // 💡 Propiedad abreviada 'token' ahora existe en el ámbito
    });
  } catch (error) {
    console.error('🛑 ERROR FATAL en registro manual:', error);
    return res.status(500).json({
      // 💡 `res` viene de los parámetros de la función
      success: false,
      message: 'Error interno del servidor al registrar usuario.',
    });
  }
} // Asegúrate de que esta llave cierre la función */
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { checkUserExists, createManualUser } from './service';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

/**
 * 🔹 Registro manual con validación avanzada
 */
export async function manualRegister(req: Request, res: Response) {
  const { name, email, password } = req.body;

  // 1️⃣ Validar campos obligatorios
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Faltan datos obligatorios.',
    });
  }

  // 2️⃣ Validar longitud del nombre y apellido
  if (name.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'El nombre y el apellido no pueden tener más de 50 caracteres.',
    });
  }

  // 3️⃣ Validar que solo contengan letras (sin números ni símbolos)
  const regexSoloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!regexSoloLetras.test(name)) {
    return res.status(400).json({
      success: false,
      message: 'El nombre y apellido solo deben contener letras.',
    });
  }

  // 4️⃣ Validar seguridad de la contraseña
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.',
    });
  }

  try {
    // 5️⃣ Verificar existencia del usuario
    const exists = await checkUserExists(email);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe.',
      });
    }

    // 6️⃣ Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7️⃣ Crear usuario (concatenamos nombre y apellido)
    const newUser = await createManualUser({
      name: `${name}`,
      email,
      password: hashedPassword,
    });

    // 8️⃣ Generar JWT
    const token = jwt.sign(
      { email: newUser.email, name: `${name}` },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 9️⃣ Respuesta
    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      user: {
        id: newUser.id,
        name,

        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error('🛑 ERROR FATAL en registro manual:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al registrar usuario.',
    });
  }
}
