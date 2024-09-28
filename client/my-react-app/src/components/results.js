import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './results.css';

function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizData, answers } = location.state;

  // Calculate score
  const totalQuestions = quizData.questions.length;
  const correctAnswers = answers.filter((answer) => {
    const question = quizData.questions.find(q => q.id === answer.questionId);
    return question && answer.selectedAnswerId === question.correctAnswerId;
  }).length;

  const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  const handleGoBack = () => {
    navigate('/makeTest');
  };

  return (
    <div className="results-container">
      <nav className='results-nav'>
        <h2 className="results-quizName">
          <span className="results-builder">Quiz Results</span>
        </h2>
        <button className='backButton' onClick={handleGoBack}>Go Back</button>
        <img className="results-iconPic" src="https://cdn-icons-png.flaticon.com/512/566/566985.png" alt="icon" />
      </nav>

      {/* Display the score */}
      <div className="results-score">
        <h3>
          Score: {correctAnswers} / {totalQuestions} ({percentage}%)
        </h3>
      </div>

      <div className="results-content">
        {quizData.questions.map((question, index) => {
          const userAnswer = answers.find((ans) => ans.questionId === question.id);
          const isCorrect = userAnswer && userAnswer.selectedAnswerId === question.correctAnswerId;

          return (
            <div key={question.id} className="results-question-container">
              <div className="results-question">
                <h3>{index + 1}. {question.questionText}</h3>
              </div>
              <div className="results-answers">
                {question.answers.map((answer) => {
                  const isSelected = userAnswer?.selectedAnswerId === answer.answerId;
                  const isCorrectAnswer = answer.answerId === question.correctAnswerId;

                  return (
                    <div
                      key={answer.answerId}
                      className={`results-answer ${
                        isSelected ? (isCorrect ? 'correct' : 'wrong') : ''
                      } ${isCorrectAnswer ? 'correct-answer' : ''}`}
                    >
                      <p>{answer.answerText}</p>
                      {/* Show checkmark if it's the correct answer */}
                      {isCorrectAnswer && <span className="checkmark">✔</span>}
                    </div>
                  );
                })}
              </div>
              <div className="results-feedback">
                {isCorrect ? <span className="correct-label">Correct!</span> : <span className="wrong-label">Wrong!</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Results;
