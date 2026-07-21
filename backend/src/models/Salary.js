const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema(
  {
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    staffName: { type: String, required: true },
    role: { type: String, required: true },
    month: { type: String, required: true }, // 'YYYY-MM'
    baseSalary: { type: Number, default: 0 },
    advanceTaken: { type: Number, default: 0 },
    penalties: { type: Number, default: 0 },
    // computed: netPayable = baseSalary - advanceTaken - penalties
  },
  { timestamps: true }
);

salarySchema.index({ staffId: 1, month: 1 }, { unique: true });

salarySchema.virtual('netPayable').get(function () {
  return Math.max(0, this.baseSalary - this.advanceTaken - this.penalties);
});

salarySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Salary', salarySchema);
