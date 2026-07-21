const express = require('express');
const PosItem = require('../models/PosItem');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/pos
router.get('/', protect, async (req, res, next) => {
  try {
    const items = await PosItem.find().sort({ name: 1 });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

// PUT /api/pos/:id/quantity
router.put('/:id/quantity', protect, async (req, res, next) => {
  try {
    const { delta } = req.body;
    const item = await PosItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    item.quantity = Math.max(0, item.quantity + delta);
    await item.save();
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
});

// POST /api/pos/checkout — reset all quantities to 0
router.post('/checkout', protect, async (req, res, next) => {
  try {
    await PosItem.updateMany({}, { quantity: 0 });
    const items = await PosItem.find().sort({ name: 1 });
    res.json({ success: true, data: items, message: 'Checkout successful' });
  } catch (err) { next(err); }
});

module.exports = router;
