const express = require('express');
const BottleRecord = require('../models/BottleRecord');
const Route = require('../models/Route');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/bottles?date=YYYY-MM-DD
router.get('/', protect, async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];

    // Auto-create bottle records for all routes if not exist
    const routes = await Route.find();
    for (const r of routes) {
      await BottleRecord.findOneAndUpdate(
        { routeId: r._id, date },
        { $setOnInsert: { routeName: r.name, issuedYesterday: r.totalBottles, collectedToday: 0, missing: 0, broken: 0 } },
        { upsert: true, new: true }
      );
    }

    const records = await BottleRecord.find({ date }).sort({ routeName: 1 });
    res.json({ success: true, data: records });
  } catch (err) { next(err); }
});

// PUT /api/bottles/:id/step
router.put('/:id/step', protect, async (req, res, next) => {
  try {
    const { field, delta } = req.body;
    const allowed = ['collectedToday', 'missing', 'broken'];
    if (!allowed.includes(field)) {
      return res.status(400).json({ success: false, message: 'Invalid field' });
    }
    const record = await BottleRecord.findByIdAndUpdate(
      req.params.id,
      { $inc: { [field]: delta } },
      { new: true }
    );
    res.json({ success: true, data: record });
  } catch (err) { next(err); }
});

module.exports = router;
