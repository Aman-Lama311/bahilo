import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotebookReason extends Document {
  schoolId: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const notebookReasonSchema = new Schema<INotebookReason>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    name: { type: String, required: true }
  },
  { timestamps: true }
);

notebookReasonSchema.index({ schoolId: 1, name: 1 }, { unique: true });

export default mongoose.model<INotebookReason>('NotebookReason', notebookReasonSchema);