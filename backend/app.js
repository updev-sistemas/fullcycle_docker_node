const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to the database');
});

app.get('/', (req, res) => {
  const name = req.query.name || 'Anonymous';
  const query = 'INSERT INTO people (name) VALUES (?)';

  db.query(query, [name], (err, result) => {
    if (err) {
      return res.status(500).send('Error inserting into the database');
    }

    db.query('SELECT name FROM people', (err, results) => {
      if (err) {
        return res.status(500).send('Error fetching from the database');
      }

      let namesList = results.map(row => row.name).join(', ');

      res.send(`<h1>Full Cycle Rocks!</h1><p>${namesList}</p>`);
    });
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
