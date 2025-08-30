import express from 'express';
import multer from 'multer';
import { authenticate, authorize } from '../middleware/auth.js';
import WasteListing from '../models/WasteListing.js';

const router = express.Router();

// Multer setup for image uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Simulated AI waste classification
const classifyWaste = (filename) => {
  const wasteTypes = {
    'coconut': 'coconut_shell',
    'rice': 'rice_husk',
    'sugarcane': 'sugarcane_stalk',
    'corn': 'corn_husk',
    'wheat': 'wheat_straw',
    'cotton': 'cotton_stalk'
  };
  
  const name = filename.toLowerCase();
  for (const [key, value] of Object.entries(wasteTypes)) {
    if (name.includes(key)) return value;
  }
  return 'other';
};

// Create waste listing
router.post('/', authenticate, authorize(['farmer']), upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      wasteType,
      quantity,
      condition,
      price,
      location,
      specifications
    } = req.body;

    // Simulate image upload (in production, use Cloudinary)
    const images = req.files ? req.files.map(file => ({
      url: `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.originalname)}`,
      publicId: `waste_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    })) : [];

    // AI classification if not provided
    const finalWasteType = wasteType || (req.files?.[0] ? classifyWaste(req.files[0].originalname) : 'other');

    const wasteListing = new WasteListing({
      farmer: req.user._id,
      title,
      description,
      wasteType: finalWasteType,
      images,
      quantity: JSON.parse(quantity),
      condition,
      price: JSON.parse(price),
      location: JSON.parse(location),
      specifications: specifications ? JSON.parse(specifications) : {}
    });

    await wasteListing.save();
    await wasteListing.populate('farmer', 'name phone location');

    res.status(201).json({
      message: 'Waste listing created successfully',
      listing: wasteListing
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all waste listings with filters
router.get('/', async (req, res) => {
  try {
    const {
      wasteType,
      condition,
      minPrice,
      maxPrice,
      latitude,
      longitude,
      radius = 50, // km
      page = 1,
      limit = 12
    } = req.query;

    let query = { 'availability.status': 'available' };

    // Filters
    if (wasteType) query.wasteType = wasteType;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) query['price.amount'].$lte = parseFloat(maxPrice);
    }

    // Geospatial query
    if (latitude && longitude) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
        }
      };
    }

    const listings = await WasteListing.find(query)
      .populate('farmer', 'name phone location profile')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await WasteListing.countDocuments(query);

    res.json({
      listings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get farmer's listings
router.get('/my-listings', authenticate, authorize(['farmer']), async (req, res) => {
  try {
    const listings = await WasteListing.find({ farmer: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await WasteListing.findById(req.params.id)
      .populate('farmer', 'name phone location profile');
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update listing
router.put('/:id', authenticate, authorize(['farmer']), async (req, res) => {
  try {
    const listing = await WasteListing.findOne({
      _id: req.params.id,
      farmer: req.user._id
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    Object.assign(listing, req.body);
    await listing.save();

    res.json({ message: 'Listing updated successfully', listing });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete listing
router.delete('/:id', authenticate, authorize(['farmer']), async (req, res) => {
  try {
    const listing = await WasteListing.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user._id
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;