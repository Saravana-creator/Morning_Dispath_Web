const mongoose = require('mongoose');

const posItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    // computed: total = price * quantity
  },
  { timestamps: true }
);

posItemSchema.virtual('total').get(function () {
  return this.price * this.quantity;
});

posItemSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('PosItem', posItemSchema);
