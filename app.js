// app.js

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'your_username',
  host: 'db',
  database: 'your_database_name',
  password: 'your_password',
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up a simple form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submissions and store data in the database
app.post('/submit', (req, res) => {
  const { name, contact } = req.body;

  // Insert data into the "contacts" table
  const query = 'INSERT INTO contacts (name, contact) VALUES ($1, $2)';
  const values = [name, contact];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error executing query', error);
      res.send('Error');
    } else {
      console.log('Data inserted successfully');
      res.send('Data inserted successfully');
    }
  });
});

// Handle fetch details request
app.get('/details', (req, res) => {
  // Select all rows from the "contacts" table
  const query = 'SELECT * FROM contacts';

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Send the fetched details as JSON response
      res.json(result.rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

