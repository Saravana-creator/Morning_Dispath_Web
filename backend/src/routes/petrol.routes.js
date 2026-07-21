const express = require('express');
const PetrolAllowance = require('../models/PetrolAllowance');
const Route = require('../models/Route');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/petrol?date=YYYY-MM-DD
router.get('/', protect, async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    
    // Auto-create PA records for all assigned DPs if not exist
    const routes = await Route.find({ assignedDpId: { $ne: null } });
    for (const r of routes) {
      await PetrolAllowance.findOneAndUpdate(
        { dpId: r.assignedDpId, date },
        {
          $setOnInsert: {
            dpName: r.assignedDpName,
            routeName: r.name,
            todaysPA: 150,
            advanceRemaining: 0,
            isPaid: false,
          },
        },
        { upsert: true, new: true }
      );
    }

    const records = await PetrolAllowance.find({ date });
    res.json({ success: true, data: records });
  } catch (err) { next(err); }
});

// PUT /api/petrol/:id/pay
router.put('/:id/pay', protect, async (req, res, next) => {
  try {
    const record = await PetrolAllowance.findByIdAndUpdate(
      req.params.id,
      { isPaid: true },
      { new: true }
    );
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, data: record });
  } catch (err) { next(err); }
});

// PUT /api/petrol/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const record = await PetrolAllowance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: record });
  } catch (err) { next(err); }
});

module.exports = router;
