const express = require("express");
const cors = require("cors");
const db = require("./db.js");

const app = express();

app.use(cors());
app.use(express.json());

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
app.put("/api/:tableName/update/:id", async (req, res) => {
  const { tableName, id } = req.params;
  try {
    const result = await db.updateRecord(tableName, req.body, id);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error updating record", details: err });
  }
});

// Delete a record by ID
app.delete("/api/:tableName/delete/:id", async (req, res) => {
  const { tableName, id } = req.params;
  try {
    const result = await db.deleteRecord(tableName, id);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error deleting record", details: err });
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

// Create a new asset
app.post("/api/Assets/create", async (req, res) => {
  try {
    const { createdDate, ...otherData } = req.body;
    const assetData = {
      ...otherData,
      createdDate: new Date(createdDate) // Parse the ISO string to a Date object
    };
    const result = await db.createRecord('Assets', assetData);
    if (result && result.length > 0) {
      res.status(201).json(result[0]);
    } else {
      res.status(500).json({ error: "Asset creation failed" });
    }
  } catch (err) {
    console.error("Error creating asset:", err);
    res.status(500).json({ error: "Error creating asset", details: err.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});