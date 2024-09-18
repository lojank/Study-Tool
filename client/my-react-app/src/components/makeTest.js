import './makeTest.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation

function MakeTest() {
  const [quizzes, setQuizzes] = useState([]); // State to store quizzes
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate(); // To navigate to the quiz page

  // Fetch quizzes from the server when the component mounts
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/user/quizzes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuizzes(response.data); // Set quizzes data
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Failed to load quizzes. Please try again later.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchQuizzes();
  }, []);

  // Handle quiz selection (redirect to quiz attempt page)
  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div className='Page'>
      <nav className='nav'>
        <h2 className="webName">
          <span className="quiz">Quiz</span> <span className="shuffle">Shuffle</span>
        </h2>
        <button className='log'>Log Out</button>
        <img className="iconPic" src="https://cdn-icons-png.flaticon.com/512/566/566985.png" alt="icon" />
      </nav>

      <h3 className="quizName">My Quizzes</h3>

      <div className="main-container">
        {/* Add a new quiz box */}
        <div className="plusBox">
          <img src="https://wumbo.net/symbols/plus/feature.png" className='plusIcon' alt="Add Quiz" />
          <span className="add-new-quiz">Add a new Quiz</span>
        </div>

        {/* Display loading state */}
        {loading && <p>Loading quizzes...</p>}

        {/* Display error message if failed */}
        {error && <p className="error-message">{error}</p>}

        {/* Display quizzes if available */}
        {!loading && quizzes.length > 0 && (
          <>
            {quizzes.map((quiz) => (
              <div key={quiz.quiz_id} className="quiz-item" onClick={() => handleQuizClick(quiz.quiz_id)}>
                <h4>{quiz.quiz_title}</h4>
                <p>{quiz.description}</p>
              </div>
            ))}
          </>
        )}

        {/* Display message if no quizzes */}
        {!loading && quizzes.length === 0 && (
          <p>No quizzes found. Create your first quiz!</p>
        )}
      </div>
    </div>
  );
}

export default MakeTest;
