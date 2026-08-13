import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotebookIssue extends Document {
  schoolId: Types.ObjectId;
  studentId: Types.ObjectId;
  notebookTypeId: Types.ObjectId;
  classId: Types.ObjectId;
  sectionId: Types.ObjectId;
  quantity: number;
  reason: string;
  issuedBy: Types.ObjectId;
  date: Date;
  createdAt: Date;
}

const notebookIssueSchema = new Schema<INotebookIssue>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    notebookTypeId: { type: Schema.Types.ObjectId, ref: 'NotebookType', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    quantity: { type: Number, required: true, min: 1 },
    reason: { type: String, required: true },
    issuedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<INotebookIssue>('NotebookIssue', notebookIssueSchema);