const express = require('express');
const InventoryItem = require('../models/InventoryItem');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/inventory
router.get('/', protect, async (req, res, next) => {
  try {
    const items = await InventoryItem.find().sort({ name: 1 });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

// PUT /api/inventory/:id — update delivered/damaged/leaked
router.put('/:id', protect, async (req, res, next) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
});

// PUT /api/inventory/:id/step — increment/decrement a field
router.put('/:id/step', protect, async (req, res, next) => {
  try {
    const { field, delta } = req.body; // field: 'delivered' | 'damaged' | 'leaked', delta: 1 | -1
    const allowed = ['delivered', 'damaged', 'leaked'];
    if (!allowed.includes(field)) {
      return res.status(400).json({ success: false, message: 'Invalid field' });
    }
    const item = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      { $inc: { [field]: delta } },
      { new: true }
    );
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
});

module.exports = router;
