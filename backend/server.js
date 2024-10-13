const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const SSE = require('express-sse');
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
const assetActivityLogRoutes = require('./routes/assetactivitylogRoutes');
const dashboardInfoCardsRoutes = require('./routes/dashboardinfocardsRoutes');
const borrowingRequestRoutes = require('./routes/borrowingrequestRoutes');

const { createEventsTable, createEventAssetsTable } = require('./models/events');

const app = express();
const sse = new SSE();
app.set('sse', sse);

app.use(cors());
app.use(bodyParser.json()); // Use body-parser middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Use routes
app.use('/api/assets', assetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/events', eventRoutes); // Use the event routes
app.use('/api/users', userRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/asset-activity-logs', assetActivityLogRoutes);
app.use('/api/dashboard', dashboardInfoCardsRoutes);
app.use('/api/borrowing-requests', borrowingRequestRoutes);

// SSE endpoint
app.get('/api/assets/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  sse.init(req, res);
});

// Update asset quantity
app.put('/api/assets/updateQuantity/:assetId', async (req, res) => {
  try {
    const { assetId } = req.params;
    const { quantity } = req.body;
    
    // Update the asset quantity in your database
    await Asset.updateQuantity(assetId, quantity);

    // Notify all clients about the quantity update
    sse.send({
      type: 'assetQuantityUpdate',
      assetId: assetId,
      newQuantity: quantity
    }, 'assetUpdate');

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating asset quantity:', error);
    res.status(500).json({ error: 'Failed to update asset quantity' });
  }
});

// Add assets to event
app.post('/api/events/:eventId/addAssets', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { assets } = req.body;

    console.log(`Received request to add assets to event ${eventId}:`, assets);

    await Event.addAssetsToEvent(eventId, assets);

    for (const asset of assets) {
      const newQuantity = asset.quantity - asset.selectedQuantity;
      console.log(`Updating asset ${asset.asset_id} quantity. Old: ${asset.quantity}, New: ${newQuantity}`);
      await Asset.updateQuantity(asset.asset_id, newQuantity);

      sse.send({
        type: 'assetQuantityUpdate',
        assetId: asset.asset_id,
        newQuantity: newQuantity
      }, 'assetUpdate');
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding assets to event:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to add assets to event', details: error.message });
  }
});

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
  console.log('API endpoints:');
  console.log('  - GET    /api/assets');
  console.log('  - POST   /api/assets');
  console.log('  - PUT    /api/assets/:id');
  console.log('  - DELETE /api/assets/:id');
  console.log('  - GET    /api/categories');
  console.log('  - POST   /api/categories');
  console.log('  - DELETE /api/categories/:categoryName');
  console.log('  - GET    /api/locations');
  console.log('  - POST   /api/locations');
  console.log('  - DELETE /api/locations/:locationName');
  console.log('  - GET    /api/events');
  console.log('  - POST   /api/events');
  console.log('  - PUT    /api/events/:uniqueId');
  console.log('  - DELETE /api/events/delete/:uniqueId');
  initializeTables();
});

const initializeTables = async () => {
  try {
    console.log('Starting table initialization...');
    await createEventsTable();
    console.log('Events table initialized');
    await User.createUserTable();
    console.log('Users table initialized');
    await Location.createLocationsTable();
    console.log('Locations table initialized');
    await Category.createCategoriesTable();
    console.log('Categories table initialized');
    await Asset.createAssetsTable();  
    console.log('Assets table initialized');
    await Supplier.createSuppliersTable();
    console.log('Suppliers table initialized');
    await createEventAssetsTable();
    console.log('Event assets table initialized');
    console.log('All tables initialized successfully');
  } catch (err) {
    console.error('Error initializing tables:', err);
  }
};

(async () => {
  try {
    await Event.addIsCompletedColumn();
    initializeTables();
  } catch (error) {
    console.error('Error during setup:', error);
  }
})();

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (!res.headersSent) {
    res.status(500).send('Something broke!');
  }
});

const pool = require('./config/database');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Connected to the database');
  }
});



