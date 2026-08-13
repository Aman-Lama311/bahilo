import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotebookStock extends Document {
  schoolId: Types.ObjectId;
  notebookTypeId: Types.ObjectId;
  quantity: number;
  date: Date;
  addedBy: Types.ObjectId;
  note?: string;
  createdAt: Date;
}

const notebookStockSchema = new Schema<INotebookStock>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    notebookTypeId: { type: Schema.Types.ObjectId, ref: 'NotebookType', required: true },
    quantity: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true, default: Date.now },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<INotebookStock>('NotebookStock', notebookStockSchema);