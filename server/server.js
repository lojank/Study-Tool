const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db'); // Database connection (we'll set this up below)
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


const secretKey = 'yourSecretKey'; // Keep this secret and secure
const arr = ['A', 'B', 'C', 'D', 'E'];

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

app.get('/quiz/:quizId', authenticateJWT, async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await pool.query('SELECT * FROM quizzes WHERE quiz_id = $1', [quizId]);
    const questions = await pool.query('SELECT * FROM questions WHERE quiz_id = $1', [quizId]);

    const quizData = {
      quizTitle: quiz.rows[0].quiz_title,
      questions: [],
    }; 

    for (const question of questions.rows) {
      const answers = await pool.query('SELECT * FROM answers WHERE question_id = $1', [question.question_id]);

      // Find the correct answer
      const correctAnswer = answers.rows.find(a => a.is_correct);

      if (!correctAnswer) {
        console.error(`No correct answer found for question_id: ${question.question_id}`);
        continue; // Skip this question if no correct answer is found
      }

      quizData.questions.push({
        id: question.question_id,
        questionText: question.question_text,
        correctAnswerId: correctAnswer.answer_id, // Get correct answer ID
        answers: answers.rows.map(answer => ({
          answerId: answer.answer_id,
          answerText: answer.answer_text,
        })),
      });
    }

    res.json(quizData);
  } catch (err) {
    console.error('Error fetching quiz:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



// Endpoint to handle quiz attempts
app.post('/quiz/:quizId/attempt', authenticateJWT, async (req, res) => {
  const { quizId } = req.params;
  const { score, answers } = req.body; // answers is an array of objects { questionId, selectedAnswerId }
  const userId = req.user.user_id;

  try { 
    // Insert a new quiz attempt
    const attemptResult = await pool.query(
      'INSERT INTO user_quiz_attempts (user_id, quiz_id, score) VALUES ($1, $2, $3) RETURNING attempt_id',
      [userId, quizId, score]
    );
    const attemptId = attemptResult.rows[0].attempt_id;

    // Insert each answer the user selected
    for (const answer of answers) {
      await pool.query(
        'INSERT INTO user_answers (attempt_id, question_id, answer_id) VALUES ($1, $2, $3)',
        [attemptId, answer.questionId, answer.selectedAnswerId]
      );
    } 

    res.status(201).json({ message: 'Quiz attempt saved successfully' });
  } catch (err) {
    console.error('Error saving quiz attempt:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Example route to get all quizzes by the authenticated user
app.get('/user/quizzes', authenticateJWT, async (req, res) => {
  const userId = req.user.user_id; // Extract user_id from JWT token

  try {
    const quizzes = await pool.query('SELECT * FROM quizzes WHERE user_id = $1', [userId]);
    res.json(quizzes.rows);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/user', authenticateJWT, async (req, res) => {
  const userId = req.user.user_id; // Extract user_id from JWT token

  try {
    const quizzes = await pool.query('SELECT username FROM users WHERE user_id = $1', [userId]);
    res.json(quizzes.rows[0]);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Create a new quiz
// Define choice labels array



// Endpoint to handle quiz creation
app.post('/quiz', authenticateJWT, async (req, res) => {
  const { title, questions } = req.body;
  const userId = req.user.user_id; // Extract user_id from JWT token

  try {
    // Insert quiz into quizzes table
    const quizResult = await pool.query(
      'INSERT INTO quizzes (user_id, quiz_title) VALUES ($1, $2) RETURNING quiz_id',
      [userId, title]
    );
    const quizId = quizResult.rows[0].quiz_id;

    // Insert each question and its answers
    for (const question of questions) {
      const questionResult = await pool.query(
        'INSERT INTO questions (quiz_id, question_text) VALUES ($1, $2) RETURNING question_id',
        [quizId, question.text]
      );
      const questionId = questionResult.rows[0].question_id;

      // Insert each choice for the question
      for (let i = 0; i < question.choices.length; i++) {
        const answerText = question.choices[i];
        const isCorrect = arr[i] === question.correctAnswer;

        await pool.query(
          'INSERT INTO answers (question_id, answer_text, is_correct) VALUES ($1, $2, $3)',
          [questionId, answerText, isCorrect]
        );
      }
    }

    res.status(201).json({ message: 'Quiz created successfully' });
  } catch (err) {
    console.error('Error creating quiz:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


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
app.delete('/quiz/:quizId', authenticateJWT, async (req, res) => {
  const { quizId } = req.params;
  try {
    // Delete from user_answers table
    await pool.query('DELETE FROM user_answers WHERE question_id IN (SELECT question_id FROM questions WHERE quiz_id = $1)', [quizId]);

    // Delete from answers table
    await pool.query('DELETE FROM answers WHERE question_id IN (SELECT question_id FROM questions WHERE quiz_id = $1)', [quizId]);

    // Delete from questions table
    await pool.query('DELETE FROM questions WHERE quiz_id = $1', [quizId]);

    // Delete from user_quiz_attempts table
    await pool.query('DELETE FROM user_quiz_attempts WHERE quiz_id = $1', [quizId]);

    // Finally, delete the quiz from quizzes table
    await pool.query('DELETE FROM quizzes WHERE quiz_id = $1', [quizId]);

    res.status(204).send(); // No content to send back
  } catch (err) {
    console.error('Error deleting quiz:', err);
    res.status(500).json({ error: 'Server error' });
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