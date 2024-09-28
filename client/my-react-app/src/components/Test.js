import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Import useParams to get route params
import './Test.css';
import axios from 'axios'; // For making HTTP requests

function Test() {
  const { quizId } = useParams();  // Get quizId from the URL params
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const navigate = useNavigate();

  // Fetch the quiz data when the component mounts
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5001/quiz/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuizData(response.data);
      } catch (err) {
        console.error('Error fetching quiz:', err);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (!quizData) {
    return <div>Loading...</div>; // Show loading state while fetching quiz data
  }

  const question = quizData.questions[currentQuestion];

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (selectedAnswer === question.correctAnswerId) {
      setScore(score + 1);
    }

    // Store the selected answer for this question
    setAnswers([...answers, { questionId: question.id, selectedAnswerId: selectedAnswer }]);

    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedAnswer(null);

      if (currentQuestion < quizData.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Quiz is complete, submit attempt
        submitQuiz();
      }
    }, 1000); // 1 second delay to show if the answer was correct or incorrect
  };

  const submitQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5001/quiz/${quizId}/attempt`,
        {
          score,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message); // Show success message
      navigate(`/makeTest`);
    } catch (err) {
      console.error('Error submitting quiz:', err);
    }
  };

  return (
    <div className="test-container">
      <nav className='test-nav'>
        <h2 className="test-quizName">
          <span className="test-builder">{quizData.quizTitle}</span>
        </h2>
        <button
  className='saveButton'
  onClick={() => {
    if (window.confirm("Are you sure you want to exit without saving?")) {
      navigate('/makeTest');
    }
  }}
>
  Exit
</button>
        <img className="test-iconPic" src="https://cdn-icons-png.flaticon.com/512/566/566985.png" alt="icon" />
      </nav>
      <div className="test-question-container">
        <div className='test-quiz-name'>
          <h2>{quizData.quizTitle}</h2>
          <p>{quizData.questions.length} Questions</p>
        </div>

        <div className='single-question'>
          <div className="test-question">
            <div className="test-badge">{currentQuestion + 1}</div>
            <h3>{question.questionText}</h3>
          </div>
          <div className="test-answers">
            {question.answers.map((answer) => (
              <div
                key={answer.answerId}
                className={`test-answer ${selectedAnswer === answer.answerId ? 'selected' : ''}`}
                onClick={() => handleAnswerClick(answer.answerId)}
              >
                <p>{answer.answerText}</p>
              </div>
            ))}
          </div>
          <div className='test-submit-container'>
            <button className="test-submit-button" onClick={handleSubmit} disabled={selectedAnswer === null}>
              Submit
            </button>
          </div>
          {isSubmitted && (
            <div className="test-result">
              {selectedAnswer === question.correctAnswerId ? "Correct!" : "Incorrect"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Test;
