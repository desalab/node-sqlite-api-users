const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Create or open the SQLite database
const db = new sqlite3.Database('./database/cognos.db');

app.use(bodyParser.json());
app.use(cors());

// GET all users
app.get('/api/v1/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET a specific user by ID
app.get('/api/v1/users/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row);
  });
});

// POST (create) a new user
app.post('/api/v1/users', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  db.run('INSERT INTO users (name,email) VALUES (?,?)', [name], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, name });
  });
});

// PUT (update) an existing user by ID
app.put('/api/v1/users/:id', (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  db.run('UPDATE users SET name = ?,email=? WHERE id = ?', [name, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id, name });
  });
});

// DELETE a user by ID
app.delete('/api/v1/users/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).end();
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
