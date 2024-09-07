const express = require("express");
const cors = require("cors");
const db = require("./db.js");
const moment = require('moment');  

const app = express();

app.use(cors());
app.use(express.json());

// Create a new asset
app.post("/api/Assets/create", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const assetData = {
      assetName: req.body.assetName,
      assetDetails: req.body.assetDetails,
      quantity: parseInt(req.body.quantity) || 0,
      cost: parseFloat(req.body.cost) || 0,
      category: req.body.category,
      location: req.body.location,
      createdDate: moment(req.body.createdDate).format('MM/DD/YYYY'),  // Format date here
      image: req.body.image, // This will be the base64 string of the image
      type: req.body.type
    };
    console.log("Processed asset data:", assetData);
    const result = await db.createRecord('assets', assetData);
    console.log("Database result:", result);
    if (result && result.length > 0) {
      console.log("Asset created successfully:", result[0]);
      res.status(201).json(result[0]);
    } else {
      console.error("Asset creation failed: No result returned from database");
      res.status(500).json({ error: "Asset creation failed", details: "No result returned from database" });
    }
  } catch (err) {
    console.error("Error creating asset:", err);
    res.status(500).json({ 
      error: "Error creating asset", 
      message: err.message,
      stack: err.stack,
      details: err.toString()
    });
  }
});

// Create a new record
app.post("/api/:tableName/create", async (req, res) => {
  const { tableName } = req.params;
  try {
    const result = await db.createRecord(tableName, req.body);
    res.status(201).json(result[0]);  // Send the created record as response
  } catch (err) {
    res.status(500).json({ error: "Error creating record", details: err });
  }
});

// Read all records from a table
app.get("/api/:tableName/read", async (req, res) => {
  const { tableName } = req.params;
  try {
    const result = await db.readRecords(tableName);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error reading records", details: err });
  }
});

// Update a record by ID
app.put("/api/Assets/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAsset = req.body;
    const result = await db.updateRecord('assets', updatedAsset, id);
    if (result && result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ error: "Asset not found" });
    }
  } catch (err) {
    console.error("Error updating asset:", err);
    res.status(500).json({ error: "Error updating asset", details: err.toString() });
  }
});

// Delete a record by ID
app.delete("/api/assets/delete/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Received delete request for asset ID:", id); // Add this log
  if (!id) {
    console.error("Invalid asset ID:", id);
    return res.status(400).json({ error: "Invalid asset ID" });
  }
  try {
    console.log(`Attempting to delete asset with id ${id}`);
    const result = await db.deleteRecord('assets', id);
    console.log("Delete result:", result);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: "Asset not found" });
    }
  } catch (err) {
    console.error("Error in delete endpoint:", err);
    res.status(500).json({ error: "Error deleting asset", details: err.toString() });
  }
});

// Get all categories
app.get("/api/categories", async (req, res) => {
  try {
    const result = await db.getCategories();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error fetching categories", details: err });
  }
});

// Get all locations
app.get("/api/locations", async (req, res) => {
  try {
    const result = await db.getLocations();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error fetching locations", details: err });
  }
});

// Add a new category
app.post("/api/categories", async (req, res) => {
  const { categoryName } = req.body;
  try {
    const result = await db.addCategory(categoryName);
    res.status(201).json(result[0]);
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).json({ error: "Error adding category", details: err.message });
  }
});

// Add a new location
app.post("/api/locations", async (req, res) => {
  const { locationName } = req.body;
  try {
    const result = await db.addLocation(locationName);
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Error adding location", details: err });
  }
});

// Delete a category
app.delete("/api/categories/:categoryName", async (req, res) => {
  const { categoryName } = req.params;
  try {
    const result = await db.deleteCategory(categoryName);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error deleting category", details: err });
  }
});

// Delete a location
app.delete("/api/locations/:locationName", async (req, res) => {
  const { locationName } = req.params;
  try {
    const result = await db.deleteLocation(locationName);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: "Location not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error deleting location", details: err });
  }
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.executeTransaction([{ query: 'SELECT NOW()', params: [] }]);
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

// Update asset's active status
app.put("/api/assets/:id/active", async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    const result = await db.updateAssetActiveStatus(id, isActive);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: "Asset not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error updating asset active status", details: err });
  }
});


// Get total active assets
app.get("/api/assets/active/count", async (req, res) => {
  try {
    const count = await db.getTotalActiveAssets();
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: "Error getting total active assets", details: err });
  }
});

// Get total available assets
app.get("/api/assets/available/count", async (req, res) => {
  try {
    const count = await db.getTotalAvailableAssets();
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: "Error getting total available assets", details: err });
  }
});

// Get sorted assets
app.get("/api/assets/sorted", async (req, res) => {
  const { sortOrder } = req.query;
  try {
    const result = await db.getAssetsSortedByActiveStatus(sortOrder);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error getting sorted assets", details: err });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});