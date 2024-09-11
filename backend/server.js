const express = require("express");
const cors = require("cors");
const assetRoutes = require('./routes/assetRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const locationRoutes = require('./routes/locationRoutes');
const Asset = require('./models/asset');
const Event = require('./models/events');
const User = require('./models/user');
const Category = require('./models/category');
const Location = require('./models/location');
const Supplier = require('./models/supplier');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/assets', assetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suppliers', supplierRoutes);

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await Asset.readAssets();
    res.json({ message: 'Database connection successful', result });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API endpoints:`);
  console.log(`  - GET    /api/assets`);
  console.log(`  - POST   /api/assets`);
  console.log(`  - PUT    /api/assets/:id`);
  console.log(`  - DELETE /api/assets/:id`);
  console.log(`  - GET    /api/categories`);
  console.log(`  - POST   /api/categories`);
  console.log(`  - DELETE /api/categories/:categoryName`);
  console.log(`  - GET    /api/locations`);
  console.log(`  - POST   /api/locations`);
  console.log(`  - DELETE /api/locations/:locationName`);
});

const initializeTables = async () => {
  try {
    await Event.createEventsTable();
    await User.createUsersTable();
    await Location.createLocationsTable();
    await Category.createCategoriesTable();
    await Asset.createAssetsTable();  
    await Supplier.createSuppliersTable();
    console.log('Tables initialized successfully');
  } catch (err) {
    console.error('Error initializing tables:', err);
  }
};

initializeTables();