import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotebookType extends Document {
  schoolId: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const notebookTypeSchema = new Schema<INotebookType>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    name: { type: String, required: true }
  },
  { timestamps: true }
);

notebookTypeSchema.index({ schoolId: 1, name: 1 }, { unique: true });

export default mongoose.model<INotebookType>('NotebookType', notebookTypeSchema);