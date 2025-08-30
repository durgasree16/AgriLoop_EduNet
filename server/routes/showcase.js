import express from 'express';
import multer from 'multer';
import { authenticate, authorize } from '../middleware/auth.js';
import Showcase from '../models/Showcase.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Create showcase
router.post('/', authenticate, authorize(['creator']), upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, materialsUsed, category, tags } = req.body;

    const images = req.files ? req.files.map(file => ({
      url: `https://via.placeholder.com/600x400?text=${encodeURIComponent(file.originalname)}`,
      publicId: `showcase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    })) : [];

    const showcase = new Showcase({
      creator: req.user._id,
      title,
      description,
      images,
      materialsUsed: JSON.parse(materialsUsed || '[]'),
      category,
      tags: JSON.parse(tags || '[]')
    });

    await showcase.save();
    await showcase.populate('creator', 'name profile');

    res.status(201).json({
      message: 'Showcase created successfully',
      showcase
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all showcases
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    
    let query = {};
    if (category) query.category = category;

    const showcases = await Showcase.find(query)
      .populate('creator', 'name profile')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Showcase.countDocuments(query);

    res.json({
      showcases,
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

// Get user showcases
router.get('/my-showcases', authenticate, authorize(['creator']), async (req, res) => {
  try {
    const showcases = await Showcase.find({ creator: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(showcases);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like/unlike showcase
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const showcase = await Showcase.findById(req.params.id);
    if (!showcase) {
      return res.status(404).json({ message: 'Showcase not found' });
    }

    const likeIndex = showcase.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      showcase.likes.splice(likeIndex, 1);
    } else {
      showcase.likes.push(req.user._id);
    }

    await showcase.save();
    res.json({ likes: showcase.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;