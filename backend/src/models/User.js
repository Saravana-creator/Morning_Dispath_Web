const mongoose = require('mongoose');

/**
 * User model — Manager auth only (Phase 1)
 * NOTE: Designed for easy PostgreSQL migration:
 *   - All fields map directly to SQL columns
 *   - No nested/embedded docs (relationships are by reference)
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['manager'], default: 'manager' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
