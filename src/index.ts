import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

//import AuthRoutes from './modules/auth/auth.routes';
import googleRouter from "./modules/controlC/google/routes";
import ubicacionRouter from "./modules/controlC/ubicacion/routes"; 
import serverRoutes from "./config/server.routes";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

//app.use("api/auth/google", AuthRoutes);
app.use("/api/controlC/google", googleRouter);
app.use("/api/controlC/ubicacion", ubicacionRouter);
app.use(serverRoutes);

app.listen(8000, () => console.log("Servidor corriendo en puerto 8000"));