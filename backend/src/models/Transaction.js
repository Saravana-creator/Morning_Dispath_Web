const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    description: { type: String, default: '' },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
