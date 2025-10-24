import { Router } from "express";
import { registrarUbicacion } from "./controller";

const router = Router();

// No necesitamos verifyJWT si ya trabajas con usuarioId desde localStorage
router.put("/", registrarUbicacion);

export default router;

