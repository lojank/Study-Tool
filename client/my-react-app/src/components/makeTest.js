import './makeTest.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MakeTest() {
  const [quizzes, setQuizzes] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null); // State to track the active dropdown
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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

  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleDelete = async (quizId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5001/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.quiz_id !== quizId));
      setActiveDropdown(null); // Close dropdown after deleting
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setError('Failed to delete quiz. Please try again later.');
    }
  };

  const handleEdit = (quizId) => {
    navigate(`/newMakeQuiz/${quizId}`);
    setActiveDropdown(null); // Close dropdown after editing
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleAddQuizClick = () => {
    navigate('/makeQuiz');
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index); // Toggle dropdown
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

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
        <div className="plusBox" onClick={handleAddQuizClick}>
          <img src="https://wumbo.net/symbols/plus/feature.png" className='plusIcon' alt="Add Quiz" />
          <span className="add-new-quiz">Add a new Quiz</span>
        </div>

        {loading && <p>Loading quizzes...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && quizzes.length > 0 && (
          <>
            {quizzes.map((quiz, index) => (
              <div 
                key={quiz.quiz_id} 
                className="quiz-item" 
                onClick={() => handleQuizClick(quiz.quiz_id)} // Make entire item clickable
              >
                <div className='box-colour'>
                  <img className="boxPic" src="https://cdn-icons-png.flaticon.com/512/566/566985.png" alt="icon" />
                </div>
                <h4 className='quizName1'>{quiz.quiz_title}</h4>
                <p>{quiz.description}</p>

                {/* Display the number of questions in the quiz */}
                <p className="question-count">{quiz.question_count} Questions</p>

                {/* Dropdown Button: Horizontal Three Dots */}
                <div className="dropdown-container" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => toggleDropdown(index)} className="dropdown-btn">
                    • • • {/* Three horizontal dots */}
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === index && (
                    <div className="dropdown-menu" ref={dropdownRef}>
                      <div className="dropdown-item" onClick={() => handleEdit(quiz.quiz_id)}>
                        Edit
                      </div>
                      <div className="dropdown-item" onClick={() => handleDelete(quiz.quiz_id)}>
                        Delete
                      </div>
                    </div>
                  )}
                </div>
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
