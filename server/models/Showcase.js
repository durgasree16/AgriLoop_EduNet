import mongoose from 'mongoose';

const showcaseSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    publicId: String
  }],
  materialsUsed: [{
    wasteType: String,
    quantity: String,
    source: String // Farm location or farmer name
  }],
  category: {
    type: String,
    enum: ['crafts', 'furniture', 'packaging', 'art', 'decor', 'other'],
    required: true
  },
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model('Showcase', showcaseSchema);