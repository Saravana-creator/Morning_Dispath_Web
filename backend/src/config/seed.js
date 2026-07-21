const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('../models/User');
const Staff = require('../models/Staff');
const Route = require('../models/Route');
const InventoryItem = require('../models/InventoryItem');
const PosItem = require('../models/PosItem');

const connectDB = require('./db');

const seed = async () => {
  await connectDB();

  // Clear existing data
  await Promise.all([
    User.deleteMany(),
    Staff.deleteMany(),
    Route.deleteMany(),
    InventoryItem.deleteMany(),
    PosItem.deleteMany(),
  ]);

  // Manager user
  const passwordHash = await bcrypt.hash('manager123', 10);
  await User.create({
    name: 'Branch Manager',
    phone: '9999999999',
    password: passwordHash,
    role: 'manager',
  });

  // Staff
  await Staff.insertMany([
    { name: 'Ramu Kumar', role: 'Delivery Person', phone: '9876543210', isActive: true },
    { name: 'Selvam G', role: 'Delivery Person', phone: '9876500001', isActive: true },
    { name: 'Karthik R', role: 'Delivery Person', phone: '9876500002', isActive: true },
    { name: 'Murugan P', role: 'Delivery Person', phone: '9876500003', isActive: true },
    { name: 'Anbu S', role: 'Delivery Person', phone: '9876500004', isActive: true },
    { name: 'Siva T', role: 'Loader', phone: '9876500005', isActive: true },
    { name: 'Balu M', role: 'Loader', phone: '9876500006', isActive: true },
  ]);

  const staffDocs = await Staff.find({ role: 'Delivery Person' });

  // Routes
  await Route.insertMany([
    {
      name: 'Route A - Anna Nagar',
      totalCustomers: 48,
      totalBottles: 52,
      assignedDpId: staffDocs[0]._id,
      assignedDpName: staffDocs[0].name,
      status: 'ready',
    },
    {
      name: 'Route B - Velachery',
      totalCustomers: 35,
      totalBottles: 38,
      assignedDpId: staffDocs[1]._id,
      assignedDpName: staffDocs[1].name,
      status: 'waiting',
    },
    {
      name: 'Route C - T. Nagar',
      totalCustomers: 60,
      totalBottles: 65,
      status: 'noDp',
    },
    {
      name: 'Route D - Adyar',
      totalCustomers: 42,
      totalBottles: 44,
      assignedDpId: staffDocs[2]._id,
      assignedDpName: staffDocs[2].name,
      status: 'ready',
    },
    {
      name: 'Route E - Tambaram',
      totalCustomers: 28,
      totalBottles: 30,
      assignedDpId: staffDocs[3]._id,
      assignedDpName: staffDocs[3].name,
      status: 'ready',
    },
  ]);

  // Inventory
  await InventoryItem.insertMany([
    { name: 'Full Bottle (1L)', received: 120, delivered: 0, damaged: 0, leaked: 0 },
    { name: 'Half Bottle (500ml)', received: 80, delivered: 0, damaged: 0, leaked: 0 },
    { name: 'Quarter Litre (250ml)', received: 60, delivered: 0, damaged: 0, leaked: 0 },
    { name: 'Curd Pouch (200g)', received: 40, delivered: 0, damaged: 0, leaked: 0 },
  ]);

  // POS items
  await PosItem.insertMany([
    { name: 'Full Bottle Milk (1L)', price: 60, quantity: 0 },
    { name: 'Half Bottle Milk (500ml)', price: 32, quantity: 0 },
    { name: 'Quarter Litre Milk (250ml)', price: 18, quantity: 0 },
    { name: 'Curd Pouch (200g)', price: 25, quantity: 0 },
    { name: 'Butter (50g)', price: 30, quantity: 0 },
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('📋 Manager login: Phone: 9999999999 | Password: manager123');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
