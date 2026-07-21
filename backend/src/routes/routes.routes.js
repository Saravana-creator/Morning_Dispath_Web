const express = require('express');
const Route = require('../models/Route');
const Staff = require('../models/Staff');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/routes
router.get('/', protect, async (req, res, next) => {
  try {
    const routes = await Route.find().sort({ name: 1 });
    res.json({ success: true, data: routes });
  } catch (err) { next(err); }
});

// PUT /api/routes/:id/assign — assign a DP to a route
router.put('/:id/assign', protect, async (req, res, next) => {
  try {
    const { dpId } = req.body;

    let updateData = { status: 'noDp', assignedDpId: null, assignedDpName: null };

    if (dpId) {
      const dp = await Staff.findById(dpId);
      if (!dp) return res.status(404).json({ success: false, message: 'Staff not found' });
      updateData = { assignedDpId: dp._id, assignedDpName: dp.name, status: 'ready' };
    }

    const route = await Route.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });

    res.json({ success: true, data: route });
  } catch (err) { next(err); }
});

// PUT /api/routes/:id/status
router.put('/:id/status', protect, async (req, res, next) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: route });
  } catch (err) { next(err); }
});

// POST /api/routes
router.post('/', protect, async (req, res, next) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json({ success: true, data: route });
  } catch (err) { next(err); }
});

module.exports = router;
