const mongoose = require('mongoose');

const petrolAllowanceSchema = new mongoose.Schema(
  {
    dpId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    dpName: { type: String, required: true },
    routeName: { type: String, required: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    todaysPA: { type: Number, default: 0 },       // Today's petrol allowance amount
    advanceRemaining: { type: Number, default: 0 }, // Deductible advance balance
    isPaid: { type: Boolean, default: false },
    // computed: todaysPayable = isPaid ? 0 : todaysPA - advanceRemaining
  },
  { timestamps: true }
);

petrolAllowanceSchema.index({ dpId: 1, date: 1 }, { unique: true });

petrolAllowanceSchema.virtual('todaysPayable').get(function () {
  if (this.isPaid) return 0;
  return Math.max(0, this.todaysPA - this.advanceRemaining);
});

petrolAllowanceSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('PetrolAllowance', petrolAllowanceSchema);
