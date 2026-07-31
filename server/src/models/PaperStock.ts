import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPaperStock extends Document {
  schoolId: Types.ObjectId;
  type: string;
  reams: number;
  sheetsPerReam: number;
  date: Date;
  addedBy: Types.ObjectId;
  note?: string;
  createdAt: Date;
}

const paperStockSchema = new Schema<IPaperStock>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    type: { type: String, required: true },
    reams: { type: Number, required: true, min: 1 },
    sheetsPerReam: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true, default: Date.now },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IPaperStock>('PaperStock', paperStockSchema);