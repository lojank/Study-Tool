const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db'); // Database connection (we'll set this up below)
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey'; // Keep this secret and secure

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing JSON bodies from incoming requests
app.use(bodyParser.json());


const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Token missing' });
  }
};

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

     // Get the newly inserted user to retrieve user_id for the token
     const newUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

     // Generate a JWT for the new user
     const token = jwt.sign({ user_id: newUser.rows[0].user_id, email: newUser.rows[0].email }, secretKey, {
       expiresIn: '1h', // Token expires in 1 hour
     });

    // Send success response
    console.log('user created');
    res.status(201).json({ message: 'Signup successful! Redirecting to homepage...', token, status: true });

  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ error: 'Server error', status: false });
  }
});

// Login endpoint
app.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email exists
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    // If user doesn't exist, return an error
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password', status: false });
    }

    // User exists, check the password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    // If the password is incorrect, return an error
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password', status: false });
    }

    // User is authenticated, generate a JWT
    const token = jwt.sign({ user_id: user.rows[0].user_id, email: user.rows[0].email }, secretKey, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    // If everything is fine, return success and possibly a token/session
    res.status(200).json({ message: 'Login successful! Redirecting to homepage...', token, status: true });

  } catch (err) {
    console.error('Error during login:', err);
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

// Verify token example
// const fetchUserData = async () => {
//   const token = localStorage.getItem('token'); // Retrieve JWT from localStorage
//   if (!token) {
//     alert('User is not logged in');
//     return;
//   }

//   try {
//     const response = await axios.get('http://localhost:5001/user-info', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log('User data:', response.data);
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//   }
// };