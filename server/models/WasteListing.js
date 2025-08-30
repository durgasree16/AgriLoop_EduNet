import mongoose from 'mongoose';

const wasteListingSchema = new mongoose.Schema({
  farmer: {
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
  wasteType: {
    type: String,
    required: true,
    enum: ['coconut_shell', 'rice_husk', 'sugarcane_stalk', 'corn_husk', 'wheat_straw', 'cotton_stalk', 'other']
  },
  images: [{
    url: String,
    publicId: String
  }],
  quantity: {
    amount: { type: Number, required: true },
    unit: { type: String, required: true, enum: ['kg', 'ton', 'bags', 'bundles'] }
  },
  condition: {
    type: String,
    enum: ['raw', 'cleaned', 'processed'],
    required: true
  },
  price: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    negotiable: { type: Boolean, default: true }
  },
  location: {
    address: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    district: String,
    state: String
  },
  availability: {
    status: { type: String, enum: ['available', 'booked', 'sold'], default: 'available' },
    harvestDate: Date,
    expiryDate: Date
  },
  specifications: {
    moistureContent: Number,
    organicCertified: { type: Boolean, default: false },
    pesticideFree: { type: Boolean, default: false }
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  views: { type: Number, default: 0 },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

// Index for geospatial queries
wasteListingSchema.index({ "location.coordinates": "2dsphere" });

export default mongoose.model('WasteListing', wasteListingSchema);