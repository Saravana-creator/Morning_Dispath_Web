require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const staffRoutes = require('./routes/staff.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const routeRoutes = require('./routes/routes.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const petrolRoutes = require('./routes/petrol.routes');
const transactionRoutes = require('./routes/transactions.routes');
const posRoutes = require('./routes/pos.routes');
const bottleRoutes = require('./routes/bottles.routes');
const salaryRoutes = require('./routes/salary.routes');
const reportRoutes = require('./routes/reports.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Maram Manager API is running 🥛' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/petrol', petrolRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/bottles', bottleRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Maram Manager API running on http://localhost:${PORT}`);
});

module.exports = app;
