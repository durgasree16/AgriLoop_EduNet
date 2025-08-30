import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['farmer', 'creator'],
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  profile: {
    avatar: String,
    bio: String,
    specialization: String, // For creators: crafts, furniture, packaging, etc.
    experience: Number
  },
  earnings: {
    total: { type: Number, default: 0 },
    pending: { type: Number, default: 0 },
    withdrawn: { type: Number, default: 0 }
  },
  ecoCredits: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);