import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStudent extends Document {
  schoolId: Types.ObjectId;
  name: string;
  classId: Types.ObjectId;
  sectionId: Types.ObjectId;
  veidaId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    name: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    veidaId: { type: String }
  },
  { timestamps: true }
);

studentSchema.index({ schoolId: 1, classId: 1, sectionId: 1, name: 1 }, { unique: true });

export default mongoose.model<IStudent>('Student', studentSchema);