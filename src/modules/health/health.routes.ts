import { Router } from 'express';

import * as HealthController from './health.controller';

import { connectDB } from '../../config/db/mongoClient';


const router = Router();

router.get('/healthy', HealthController.getHealthStatusController);

// Nueva ruta para probar la conexión a la base de datos
router.get('/db-status', async (req, res) => {
  try {
    const db = await connectDB();
    res.json({ status: 'ok', dbName: db.databaseName });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      status: 'error',
      error: mensaje,
      dbName: process.env.DB_NAME || 'No definido'
    });
  }
});


export default router;
