const mongoose = require('mongoose');

// One record per staff per date
const attendanceSchema = new mongoose.Schema(
  {
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    staffName: { type: String, required: true },
    role: { type: String, required: true },
    date: { type: String, required: true }, // ISO date string: 'YYYY-MM-DD'
    status: {
      type: String,
      enum: ['none', 'present', 'absent', 'standby'],
      default: 'none',
    },
  },
  { timestamps: true }
);

// Unique constraint: one attendance record per staff per day
attendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
