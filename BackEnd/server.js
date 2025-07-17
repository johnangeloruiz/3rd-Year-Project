/**
 * Main server entry for AIEs backend
 * Sets up Express app, middleware, and routes
 * All business logic is in controllers/, validation in validators/, DB in db/
 */
const express = require("express");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST, GET"],
  credentials: true
}));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const contactRoutes = require('./routes/contact');
const salesRoutes = require('./routes/sales');
// TODO: import other routes (products, cart, sales, contact)

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/sales', salesRoutes);
// TODO: use other routes

// 404 handler
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Start server
app.listen(8081, () => {
  console.log("listening");
});