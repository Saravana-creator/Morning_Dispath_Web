const express = require('express');
const Transaction = require('../models/Transaction');
const PetrolAllowance = require('../models/PetrolAllowance');
const Route = require('../models/Route');
const BottleRecord = require('../models/BottleRecord');
const Salary = require('../models/Salary');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/reports?date=YYYY-MM-DD&month=YYYY-MM
router.get('/', protect, async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const month = req.query.month || date.slice(0, 7);

    // Total collections (income transactions today)
    const txns = await Transaction.find({ date, type: 'income' });
    const totalCollections = txns.reduce((sum, t) => sum + t.amount, 0);

    // Pending advances (unpaid salary advances this month)
    const salaries = await Salary.find({ month });
    const pendingAdvances = salaries.reduce((sum, s) => sum + s.advanceTaken, 0);

    // Routes completed (status 'ready' vs total)
    const allRoutes = await Route.find();
    const routesCompleted = allRoutes.filter(r => r.status === 'ready').length;

    // Missing bottles today
    const bottleRecords = await BottleRecord.find({ date });
    const missingBottles = bottleRecords.reduce((sum, b) => sum + b.missing + b.broken, 0);

    // Petrol paid today
    const petrolPaid = await PetrolAllowance.find({ date, isPaid: true });
    const totalPetrolPaid = petrolPaid.reduce((sum, p) => sum + p.todaysPA, 0);

    res.json({
      success: true,
      data: {
        totalCollections,
        pendingAdvances,
        routesCompleted,
        totalRoutes: allRoutes.length,
        missingBottles,
        totalPetrolPaid,
        date,
        month,
      },
    });
  } catch (err) { next(err); }
});

module.exports = router;
