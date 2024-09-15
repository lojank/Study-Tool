const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db'); // Database connection (we'll set this up below)
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing JSON bodies from incoming requests
app.use(bodyParser.json());

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // Check if email already exists
  const emailExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (emailExists.rows.length > 0) {
    return res.status(400).json({ message: 'Email already exists', status: false });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Insert new user into the database
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [first_name + ' ' + last_name, email, hashedPassword]
    );

    // Send success response
    console.log('user created');
    res.status(201).json({ message: 'Signup successful! Redirecting to homepage...', status: true });

  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ error: 'Server error', status: false });
  }
});


// Example route to get all users from the database
app.get('/users', async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users');
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Listen on a port
const port = process.env.PORT || 5001; 
app.listen(port, ()=> console.log(`Server Started on port ${port}...`))
