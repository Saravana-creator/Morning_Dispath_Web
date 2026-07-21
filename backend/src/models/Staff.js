const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true }, // 'Delivery Person' | 'Loader' | etc.
    phone: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    photoUrl: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);
