const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    totalCustomers: { type: Number, default: 0 },
    totalBottles: { type: Number, default: 0 },
    assignedDpId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
    assignedDpName: { type: String, default: null },
    status: {
      type: String,
      enum: ['ready', 'waiting', 'noDp'],
      default: 'noDp',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Route', routeSchema);
