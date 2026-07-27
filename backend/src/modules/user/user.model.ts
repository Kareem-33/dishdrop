import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

enum UNITS { 'metric', 'imperial' };
enum PROVIDERS { 'local', 'google' };

export interface IUser extends Document {
  name: string,
  email: string,
  password: string,
  avatar?: string,
  measureUnits: string;
  isVerified: boolean,
  provider: string,
  googleId?: String,
  resetPasswordToken?: string | undefined,
  resetPasswordExpires?: Date | undefined,
  verificationToken?: string | undefined,
  verificationExpires?: Date | undefined,
  createdAt: Date,
  updatedAt: Date,
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  measureUnits: {
    type: String,
    enum: UNITS,
    default: 'metric',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  provider: {
    type: String,
    enum: PROVIDERS,
    default: 'local',
  },
  googleId: {
    type: String,
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  verificationToken: {
    type: String
  },
  verificationExpires: {
    type: Date
  }
}, { timestamps: true });

userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model<IUser>('user', userSchema);
export default User;