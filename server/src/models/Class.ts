import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IClass extends Document {
  schoolId: Types.ObjectId;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    name: { type: String, required: true },
    order: { type: Number, required: true }
  },
  { timestamps: true }
);

// same class name shouldn't repeat within a school, but can across schools
classSchema.index({ schoolId: 1, name: 1 }, { unique: true });

export default mongoose.model<IClass>('Class', classSchema);