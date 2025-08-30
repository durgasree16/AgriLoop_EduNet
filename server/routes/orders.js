import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Order from '../models/Order.js';
import WasteListing from '../models/WasteListing.js';
import User from '../models/User.js';

const router = express.Router();

// Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const { wasteListingId, quantity, totalAmount, pickup } = req.body;

    const listing = await WasteListing.findById(wasteListingId);
    if (!listing || listing.availability.status !== 'available') {
      return res.status(400).json({ message: 'Listing not available' });
    }

    const order = new Order({
      wasteListing: wasteListingId,
      farmer: listing.farmer,
      creator: req.user._id,
      quantity,
      totalAmount,
      pickup
    });

    await order.save();
    await order.populate(['farmer', 'creator', 'wasteListing']);

    // Update listing status
    listing.availability.status = 'booked';
    await listing.save();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user orders
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const query = req.user.role === 'farmer' 
      ? { farmer: req.user._id }
      : { creator: req.user._id };

    const orders = await Order.find(query)
      .populate('farmer', 'name phone location')
      .populate('creator', 'name phone location')
      .populate('wasteListing', 'title wasteType images')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (req.user.role === 'farmer' && !order.farmer.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (req.user.role === 'creator' && !order.creator.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = status;
    await order.save();

    // Update farmer earnings on completion
    if (status === 'completed' && order.paymentStatus === 'paid') {
      await User.findByIdAndUpdate(order.farmer, {
        $inc: { 'earnings.total': order.totalAmount }
      });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add chat message
router.post('/:id/chat', authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is part of this order
    if (!order.farmer.equals(req.user._id) && !order.creator.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.chat.push({
      sender: req.user._id,
      message,
      timestamp: new Date()
    });

    await order.save();
    await order.populate('chat.sender', 'name');

    res.json({ message: 'Message sent', chat: order.chat });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;