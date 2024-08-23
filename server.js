const express = require("express");
const cors = require("cors");
const db = require("./db.js");

const app = express();

app.use(cors());
app.use(express.json());

const tableName = "Users";  // Specify the table name here

// Create a new user record
app.post("/api/create", async (req, res) => {
  try {
    const result = await db.createRecord(tableName, req.body);
    res.status(201).json(result);  // Send the created record as response
  } catch (err) {
    res.status(500).json({ error: "Error creating record", details: err });
  }
});

// Read all user records
app.get("/api/read", async (req, res) => {
  try {
    const result = await db.readRecords(tableName);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error reading records", details: err });
  }
});

// Update a user record
app.put("/api/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.updateRecord(tableName, req.body, id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error updating record", details: err });
  }
});

// Delete a user record
app.delete("/api/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.deleteRecord(tableName, id);
    if (result) {
      res.status(200).json(result);
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
