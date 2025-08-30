import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  wasteListing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteListing',
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    amount: { type: Number, required: true },
    unit: { type: String, required: true }
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'picked_up', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  pickup: {
    scheduledDate: Date,
    actualDate: Date,
    address: String,
    instructions: String
  },
  chat: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now },
    messageType: { type: String, enum: ['text', 'image'], default: 'text' }
  }],
  rating: {
    farmerRating: { type: Number, min: 1, max: 5 },
    creatorRating: { type: Number, min: 1, max: 5 },
    farmerReview: String,
    creatorReview: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);