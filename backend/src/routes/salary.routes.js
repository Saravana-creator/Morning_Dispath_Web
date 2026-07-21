const express = require('express');
const Salary = require('../models/Salary');
const Staff = require('../models/Staff');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/salary?month=YYYY-MM
router.get('/', protect, async (req, res, next) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);

    // Auto-create salary records for all active staff if not exist
    const allStaff = await Staff.find({ isActive: true });
    for (const s of allStaff) {
      await Salary.findOneAndUpdate(
        { staffId: s._id, month },
        { $setOnInsert: { staffName: s.name, role: s.role, baseSalary: 12000, advanceTaken: 0, penalties: 0 } },
        { upsert: true, new: true }
      );
    }

    const records = await Salary.find({ month }).sort({ staffName: 1 });
    res.json({ success: true, data: records });
  } catch (err) { next(err); }
});

// PUT /api/salary/:id/advance
router.put('/:id/advance', protect, async (req, res, next) => {
  try {
    const { amount } = req.body;
    const record = await Salary.findByIdAndUpdate(
      req.params.id,
      { $inc: { advanceTaken: amount || 500 } },
      { new: true }
    );
    if (!record) return res.status(404).json({ success: false, message: 'Salary record not found' });
    res.json({ success: true, data: record });
  } catch (err) { next(err); }
});

module.exports = router;
