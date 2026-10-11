import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { config } from '../config/env.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'student', classGrade = 8, preferredLanguage = 'en' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (role === 'student') {
      await StudentProfile.create({
        userId: user._id,
        classGrade,
        preferredLanguage,
        selectedSubjects: ['Mathematics', 'Science', 'English'],
        learningGoals: ['Understand core concepts', 'Improve exam confidence'],
      });
    }

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error during registration.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id.toString());

    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ userId: user._id });
    }

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isDemoUser: user.isDemoUser,
      },
      profile,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error during login.' });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found in context.' });
    }

    let profile = null;
    if (req.user.role === 'student') {
      profile = await StudentProfile.findOne({ userId: req.user._id });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isDemoUser: req.user.isDemoUser,
      },
      profile,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { classGrade, preferredLanguage, learningGoals, dailyGoalMinutes } = req.body;

    if (req.user.role === 'student') {
      const profile = await StudentProfile.findOneAndUpdate(
        { userId: req.user._id },
        {
          ...(classGrade && { classGrade }),
          ...(preferredLanguage && { preferredLanguage }),
          ...(learningGoals && { learningGoals }),
          ...(dailyGoalMinutes && { dailyGoalMinutes }),
        },
        { new: true, upsert: true }
      );

      return res.status(200).json({ success: true, profile });
    }

    return res.status(200).json({ success: true, message: 'Profile updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
