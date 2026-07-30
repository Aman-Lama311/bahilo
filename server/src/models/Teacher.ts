import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITeacher extends Document {
  schoolId: Types.ObjectId;
  name: string;
  assignedSections: Types.ObjectId[];
  veidaId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const teacherSchema = new Schema<ITeacher>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    name: { type: String, required: true },
    assignedSections: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
    veidaId: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<ITeacher>('Teacher', teacherSchema);