import { Router } from 'express';
import { connectDB } from '../../config/db/mongoClient';
import { ObjectId } from 'mongodb';

const router = Router();

router.put('/requester', async (req, res) => {
  try {
    const db = await connectDB();
    const { id, phone, location } = req.body;

    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Missing requester id' });
    }

    const _id = new ObjectId(id);

    const result = await db.collection('profile').updateOne(
      { _id },
      { $set: { phone, location } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ status: 'error', message: 'Profile not found' });
    }

    res.json({ status: 'ok', message: 'Profile updated successfully' });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    console.error('Error en PUT /requester:', mensaje);
    res.status(330).json({
      status: 'error',
      error: mensaje,
      dbName: process.env.DB_NAME || 'No definido',
    });
  }
});

export default router;
