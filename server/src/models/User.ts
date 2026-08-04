import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  schoolId?: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  isSuperAdmin: boolean;
  isPlatformOwner: boolean;
  permissions: string[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: function (this: IUser) {
        return !this.isPlatformOwner;
      }
    },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isSuperAdmin: { type: Boolean, default: false },
    isPlatformOwner: { type: Boolean, default: false },
    permissions: [{ type: String }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

// email is unique per school, not globally — two schools can each have "admin@school.com"
userSchema.index({ schoolId: 1, email: 1 }, { unique: true });

export default mongoose.model<IUser>('User', userSchema);