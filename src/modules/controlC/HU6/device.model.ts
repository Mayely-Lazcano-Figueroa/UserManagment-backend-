import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
  userId: string;
  deviceId: string;
  type: string;
  browser?: string;
  location?: string;
  lastActive: Date;
}

const deviceSchema = new Schema<IDevice>({
  userId: { type: String, required: true },
  deviceId: { type: String, required: true },
  type: { type: String, required: true },
  browser: String,
  location: String,
  lastActive: { type: Date, default: Date.now },
});

export default mongoose.model<IDevice>('Device', deviceSchema);
