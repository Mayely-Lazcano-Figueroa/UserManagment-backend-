import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dispositivosRoutes from "./routes";

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/skyclass")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar MongoDB:", err));

// Rutas
app.use("/api/dispositivos", dispositivosRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
