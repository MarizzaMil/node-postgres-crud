const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

// Create a new hero
app.post('/heroes', async (req, res) => {
  const { name, superPower } = req.body;
  const query = 'INSERT INTO heroes (name, superpower) VALUES ($1, $2) RETURNING *';
  const values = [name, superPower];

  try {
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating hero' });
  }
});

// Get all heroes
app.get('/heroes', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM heroes');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching heroes' });
  }
});

// Get a hero by ID
app.get('/heroes/:id', async (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM heroes WHERE id = $1';
  const values = [id];

  try {
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Hero not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching hero' });
  }
});

// Update a hero by ID
app.put('/heroes/:id', async (req, res) => {
  const id = req.params.id;
  const { name, superPower } = req.body;
  const query = 'UPDATE heroes SET name = $1, superpower = $2 WHERE id = $3 RETURNING *';
  const values = [name, superPower, id];

  try {
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Hero not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating hero' });
  }
});

// Delete a hero by ID
app.delete('/heroes/:id', async (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM heroes WHERE id = $1';
  const values = [id];

  try {
    const result = await db.query(query, values);
    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Hero not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting hero' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
