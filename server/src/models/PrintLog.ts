import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPrintLog extends Document {
  schoolId: Types.ObjectId;
  date: Date;
  teacherId?: Types.ObjectId;
  classId?: Types.ObjectId;
  sectionId?: Types.ObjectId;
  departmentId?: Types.ObjectId;
  purpose: string;
  sheetsUsed: number;
  printerId?: Types.ObjectId;
  loggedBy: Types.ObjectId;
  createdAt: Date;
}

const printLogSchema = new Schema<IPrintLog>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    date: { type: Date, required: true, default: Date.now },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    classId: { type: Schema.Types.ObjectId, ref: 'Class' },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section' },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
    purpose: { type: String, required: true },
    sheetsUsed: { type: Number, required: true, min: 1 },
    printerId: { type: Schema.Types.ObjectId },
    loggedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IPrintLog>('PrintLog', printLogSchema);