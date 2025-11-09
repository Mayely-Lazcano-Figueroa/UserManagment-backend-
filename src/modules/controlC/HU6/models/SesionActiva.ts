import { Schema, model, Document, Types } from "mongoose";

export interface ISesionActiva extends Document {
  usuarioId: Types.ObjectId;  // 👈 en vez de string
  tipo_dispositivo: string;
  ubicacion?: string;
  ultima_actividad: Date;
}

const SesionActivaSchema = new Schema<ISesionActiva>({
  usuarioId: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  tipo_dispositivo: { type: String, required: true },
  ubicacion: { type: String },
  ultima_actividad: { type: Date, default: Date.now },
});

export const SesionActiva = model<ISesionActiva>("SesionActiva", SesionActivaSchema);
