const express = require('express');
const Staff = require('../models/Staff');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/staff
router.get('/', protect, async (req, res, next) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.json({ success: true, data: staff });
  } catch (err) { next(err); }
});

// GET /api/staff/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const member = await Staff.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.json({ success: true, data: member });
  } catch (err) { next(err); }
});

// POST /api/staff
router.post('/', protect, async (req, res, next) => {
  try {
    const member = await Staff.create(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (err) { next(err); }
});

// PUT /api/staff/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const member = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.json({ success: true, data: member });
  } catch (err) { next(err); }
});

// DELETE /api/staff/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Staff removed' });
  } catch (err) { next(err); }
});

module.exports = router;
