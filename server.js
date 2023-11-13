const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SwamiMaharaj@11',
  database: 'taskdb',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected');
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoints
app.get('/api/todos', (req, res) => {
  const getAllTodosQuery = 'SELECT * FROM todos';
  db.query(getAllTodosQuery, (err, result) => {
    if (err) {
      console.error('Error fetching todos from database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('Todos fetched successfully:', result);
    res.json(result);
  });
});

app.post('/api/todos', (req, res) => {
  const { name, status } = req.body;
  console.log('Received data for insertion:', name, status);

  const insertTodoQuery = 'INSERT INTO todos (name, status) VALUES (?, ?)';
  db.query(insertTodoQuery, [name, status], (err, result) => {
    if (err) {
      console.error('Error inserting todo into database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('Todo inserted successfully:', result);
    res.json({ id: result.insertId, name, status });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
