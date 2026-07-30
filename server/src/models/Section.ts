import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISection extends Document {
  schoolId: Types.ObjectId;
  classId: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const sectionSchema = new Schema<ISection>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    name: { type: String, required: true }
  },
  { timestamps: true }
);

// same section name shouldn't repeat within the same class
sectionSchema.index({ classId: 1, name: 1 }, { unique: true });

export default mongoose.model<ISection>('Section', sectionSchema);