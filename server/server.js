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
        answerOption: correctAnswer.answer_option,
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

// Update an existing quiz
app.put('/quiz/:quizId', authenticateJWT, async (req, res) => {
  const { quizId } = req.params;
  const { title, questions } = req.body;
  const arr = ['A', 'B', 'C', 'D', 'E']; // Answer options

  try {
    // Update the quiz title
    await pool.query('UPDATE quizzes SET quiz_title = $1 WHERE quiz_id = $2', [title, quizId]);

    // Remove existing questions and their answers 
    await pool.query('DELETE FROM answers WHERE question_id IN (SELECT question_id FROM questions WHERE quiz_id = $1)', [quizId]);
    await pool.query('DELETE FROM questions WHERE quiz_id = $1', [quizId]);

    // Insert new questions and answers
    for (const question of questions) {
      // Insert the new question and get its ID
      const result = await pool.query(
        'INSERT INTO questions (quiz_id, question_text) VALUES ($1, $2) RETURNING question_id',
        [quizId, question.text]
      );
      const questionId = result.rows[0].question_id;

      // Insert answers for the new question with answer options (A, B, C, D, E)
      for (let i = 0; i < question.choices.length; i++) {
        const answerText = question.choices[i];
        const isCorrect = arr[i] === question.correctAnswer; // Check if the choice matches the correct answer
        const answerOption = arr[i]; // Set the answer option (A, B, C, D, E)

        await pool.query(
          'INSERT INTO answers (question_id, answer_text, is_correct, answer_option) VALUES ($1, $2, $3, $4)',
          [questionId, answerText, isCorrect, answerOption]
        );
      }
    }

    res.status(200).json({ message: 'Quiz updated successfully' });
  } catch (err) {
    console.error('Error updating quiz:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/quiz/:quizId/attempt', authenticateJWT, async (req, res) => {
  const { quizId } = req.params;
  const { score, answers } = req.body; // Answers is an array of objects { questionId, selectedAnswerId }
  const userId = req.user.user_id;

  try { 
    // Insert a new quiz attempt
    const attemptResult = await pool.query(
      'INSERT INTO user_quiz_attempts (user_id, quiz_id, score) VALUES ($1, $2, $3) RETURNING attempt_id',
      [userId, quizId, score]
    );
    const attemptId = attemptResult.rows[0].attempt_id;

    // Loop through the answers array and insert each answer
    for (const answer of answers) {
      console.log('Inserting answer:', answer); // Updated log

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
    // Query to get quizzes along with the count of questions for each quiz
    const quizzes = await pool.query(`
      SELECT q.quiz_id, q.user_id, q.quiz_title, q.description, q.created_at, COUNT(ques.question_id) AS question_count
      FROM quizzes q
      LEFT JOIN questions ques ON q.quiz_id = ques.quiz_id
      WHERE q.user_id = $1
      GROUP BY q.quiz_id
    `, [userId]);

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
  const arr = ['A', 'B', 'C', 'D', 'E']; // Answer options

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

      // Insert each choice for the question with the answer option (A, B, C, D, E)
      for (let i = 0; i < question.choices.length; i++) {
        const answerText = question.choices[i];
        const isCorrect = arr[i] === question.correctAnswer;
        const answerOption = arr[i]; // Set answer option (A, B, C, D, E)

        await pool.query(
          'INSERT INTO answers (question_id, answer_text, is_correct, answer_option) VALUES ($1, $2, $3, $4)',
          [questionId, answerText, isCorrect, answerOption]
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