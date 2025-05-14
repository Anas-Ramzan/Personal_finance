// models/FinancialRecord.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IFinancialRecord extends Document {
  userId: string;
  date: Date;
  descr: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

const FinancialRecordSchema: Schema = new Schema({
  userId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  descr: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  paymentMethod: { type: String, required: true },
});

export default mongoose.model<IFinancialRecord>('FinancialRecord', FinancialRecordSchema);
