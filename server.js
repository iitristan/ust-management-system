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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});