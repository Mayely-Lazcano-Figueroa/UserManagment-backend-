import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dispositivosRoutes from "./routes";
import * as useragent from "express-useragent";




const app = express();
app.use(cors());
app.use(express.json());
app.use(useragent.express());
// 🔗 Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:3000/ServineoDB")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar MongoDB:", err));

// Rutas
app.use("/api/dispositivos", dispositivosRoutes);
import sesionRoutes from "../HU6/routes";
app.use("/api/sesiones", sesionRoutes);
const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
