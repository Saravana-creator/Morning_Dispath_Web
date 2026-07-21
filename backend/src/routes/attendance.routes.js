const express = require('express');
const Attendance = require('../models/Attendance');
const Staff = require('../models/Staff');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/attendance?date=YYYY-MM-DD
router.get('/', protect, async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    
    // Get all staff
    const allStaff = await Staff.find().sort({ name: 1 });
    
    // Get existing attendance for that date
    const existing = await Attendance.find({ date });
    const existingMap = {};
    existing.forEach(a => { existingMap[a.staffId.toString()] = a; });

    // Merge: return attendance for all staff (create defaults for missing ones)
    const result = allStaff.map(s => ({
      _id: existingMap[s._id.toString()]?._id || null,
      staffId: s._id,
      staffName: s.name,
      role: s.role,
      date,
      status: existingMap[s._id.toString()]?.status || 'none',
    }));

    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// PUT /api/attendance/:staffId — upsert attendance for a staff on a date
router.put('/:staffId', protect, async (req, res, next) => {
  try {
    const { date, status } = req.body;
    const staff = await Staff.findById(req.params.staffId);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

    const attendance = await Attendance.findOneAndUpdate(
      { staffId: req.params.staffId, date },
      { staffName: staff.name, role: staff.role, status },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ success: true, data: attendance });
  } catch (err) { next(err); }
});

module.exports = router;
