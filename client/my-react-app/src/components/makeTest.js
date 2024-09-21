import './makeTest.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MakeTest() {
  const [quizzes, setQuizzes] = useState([]);
  const [username, setUsername] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch quizzes from the server when the component mounts
// Fetch quizzes and username from the server when the component mounts
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      const [quizzesResponse, userResponse] = await Promise.all([
        axios.get('http://localhost:5001/user/quizzes', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5001/user', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setQuizzes(quizzesResponse.data);
      setUsername(userResponse.data.username);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  // Handle quiz selection
  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  // Handle quiz deletion
  const handleDelete = async (event, quizId) => {
    event.stopPropagation(); // Stop the click event from bubbling up
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5001/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.quiz_id !== quizId)); // Update the state to remove the deleted quiz
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setError('Failed to delete quiz. Please try again later.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    navigate('/'); // Redirect to the login page
  };

  return (
    <div className='Page'>
      <nav className='nav'>
        <h2 className="webName">
          <span className="quiz">Quiz</span> <span className="shuffle">Shuffle</span>
        </h2>
        <div className='welcome-container'>
          <span className='username'>Welcome {username}</span>
          <button className='log' onClick={handleLogout}>Log Out</button>
        </div>  
        <img className="iconPic" src="https://cdn-icons-png.flaticon.com/512/566/566985.png" alt="icon" />
      </nav>

      <h3 className="quizName">My Quizzes</h3>

      <div className="main-container">
        <div className="plusBox">
          <img src="https://wumbo.net/symbols/plus/feature.png" className='plusIcon' alt="Add Quiz" />
          <span className="add-new-quiz">Add a new Quiz</span>
        </div>

        {loading && <p>Loading quizzes...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && quizzes.length > 0 && (
          <>
            {quizzes.map((quiz) => (
              <div key={quiz.quiz_id} className="quiz-item" onClick={() => handleQuizClick(quiz.quiz_id)}>
                <h4>{quiz.quiz_title}</h4>
                <p>{quiz.description}</p>
                <button className="delete-btn" onClick={(event) => handleDelete(event, quiz.quiz_id)}>Delete</button>
              </div>
            ))}
          </>
        )}

        {!loading && quizzes.length === 0 && (
          <p>No quizzes found. Create your first quiz!</p>
        )}
      </div>
    </div>
  );
}

export default MakeTest;

