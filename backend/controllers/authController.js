import mongoose from "mongoose";
import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_SECRET = process.env.JWT_SECRET;

const validateInvitationCode = async (code) => {
  const candidates = await User.find({
    'invitationCode.used': false,
    'invitationCode.createdAt': { $gte: new Date(Date.now() - 86400000) }
  });
  for (const candidate of candidates) {
    if (candidate.invitationCode.code) {
      console.log('Plain-text code:', code);
      console.log('Hashed code:', candidate.invitationCode.code);
      const isMatch = await bcrypt.compare(code, candidate.invitationCode.code);
      if (isMatch) return candidate;
    }
  }
  return null;
};


export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password, invitationCode } = req.body;

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error("User already exists", { statusCode: 409 });
    }

    

    // Set default role; first user becomes admin regardless.
    let role = 'user';
    const userCount = await User.countDocuments().session(session);
    if (userCount === 0) role = 'admin';

    let invitationOwner;
    // If an invitation code is provided, validate it and upgrade role to admin.
    if (invitationCode) {
      invitationOwner = await validateInvitationCode(invitationCode);
      if (!invitationOwner) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Invalid or expired invitation code' });
      }
      role = 'admin'; // Upgrade the new user to admin
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create([{
      name,
      email,
      password: hashedPassword,
      role
    }], { session });

    // If invitation code was used, mark it as used and generate a new one for the invitation owner.
    if (invitationOwner) {
      await invitationOwner.useInvitationCode(session);
    }

    const token = jwt.sign(
      { userId: newUser[0]._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: `User ${name} created successfully`,
      data: { token, user: newUser[0] }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password, invitationCode } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found", { statusCode: 404 });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid Password", { statusCode: 401 });

    // If an invitation code is provided, validate it and upgrade user's role if not already admin.
    if (invitationCode) {
      const invitationOwner = await validateInvitationCode(invitationCode);
      if (!invitationOwner) {
        return res.status(400).json({ message: 'Invalid or expired invitation code' });
      }
      if (user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }
      // Mark the invitation code as used and generate a new code for the invitation owner.
      await invitationOwner.useInvitationCode();
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: { token, user }
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  res.status(200).json({ message: 'Sign out successful' });
};


