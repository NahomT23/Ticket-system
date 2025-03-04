import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import { randomBytes } from 'crypto';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  invitationCode: {
    code: {
      type: String,
      sparse: true, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.hashInvitationCode = async function (code) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(code, salt);
};


userSchema.methods.generateInvitationCode = async function (session) {
  if (this.role !== 'admin') {
    throw new Error('Only admins can generate codes');
  }
  const code = randomBytes(6).toString('hex').toUpperCase();
  const hashedCode = await this.hashInvitationCode(code);

  this.invitationCode.code = hashedCode;
  this.invitationCode.createdAt = new Date();
  this.invitationCode.used = false;
  await this.save({ session });

  return code; 
};


userSchema.methods.validateInvitationCode = async function (code) {
  if (this.invitationCode && !this.invitationCode.used) {
    const isMatch = await bcrypt.compare(code, this.invitationCode.code);
    return isMatch;
  }
  return false;
};

userSchema.methods.useInvitationCode = async function () {
  if (this.invitationCode && !this.invitationCode.used) {
    this.invitationCode.used = true;
    await this.save();
    await this.generateInvitationCode();
  } else {
    throw new Error('Invitation code has already been used or does not exist');
  }
};

export default mongoose.model('User', userSchema);
