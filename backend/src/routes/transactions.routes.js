const express = require('express');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/transactions?date=YYYY-MM-DD
router.get('/', protect, async (req, res, next) => {
  try {
    const filter = req.query.date ? { date: req.query.date } : {};
    const txns = await Transaction.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: txns });
  } catch (err) { next(err); }
});

// POST /api/transactions
router.post('/', protect, async (req, res, next) => {
  try {
    const txn = await Transaction.create(req.body);
    res.status(201).json({ success: true, data: txn });
  } catch (err) { next(err); }
});

// DELETE /api/transactions/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Transaction deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
