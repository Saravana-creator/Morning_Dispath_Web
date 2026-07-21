const mongoose = require('mongoose');

const bottleRecordSchema = new mongoose.Schema(
  {
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    routeName: { type: String, required: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    issuedYesterday: { type: Number, default: 0 },
    collectedToday: { type: Number, default: 0 },
    missing: { type: Number, default: 0 },
    broken: { type: Number, default: 0 },
    // computed: pending = issuedYesterday - collectedToday - missing - broken
  },
  { timestamps: true }
);

bottleRecordSchema.index({ routeId: 1, date: 1 }, { unique: true });

bottleRecordSchema.virtual('pending').get(function () {
  return Math.max(0, this.issuedYesterday - this.collectedToday - this.missing - this.broken);
});

bottleRecordSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('BottleRecord', bottleRecordSchema);
