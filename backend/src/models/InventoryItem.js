const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    received: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    damaged: { type: Number, default: 0 },
    leaked: { type: Number, default: 0 },
    // computed: remaining = received - delivered - damaged - leaked (calculated in API)
  },
  { timestamps: true }
);

// Virtual for remaining (not stored, computed on read)
inventoryItemSchema.virtual('remaining').get(function () {
  return this.received - this.delivered - this.damaged - this.leaked;
});

inventoryItemSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
