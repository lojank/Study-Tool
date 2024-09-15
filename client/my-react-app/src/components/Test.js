import React, { useState } from 'react';
import './Test.css';
import sampleData from './sampleData';

function Test() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const question = sampleData.questions[currentQuestion];

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedAnswer(null);

      if (currentQuestion < sampleData.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        alert(`Quiz complete! Your score is ${score + (selectedAnswer === question.correctAnswer ? 1 : 0)} out of ${sampleData.questions.length}`);
      }
    }, 1000); // 1 second delay to show if the answer was correct or incorrect
  };

  return (
    <div className="test-container">
      <nav className='test-nav'>
        <h2 className="test-quizName">
          <span className="test-builder">Test</span>
        </h2>
        <button className='saveButton'>Save</button>
        <img className="test-iconPic" src="https://cdn-icons-png.flaticon.com/512/566/566985.png" alt="icon" />
      </nav>
      <div className="test-question-container">
        <div className='test-quiz-name'>
          <h2>{sampleData.quizName}</h2>
          <p>{sampleData.totalQuestions} Questions</p>
        </div>

        <div className='single-question'>
          <div className="test-question">
            <div className="test-badge">{question.id}</div>
            <h3>{question.question}</h3>
          </div>
          <div className="test-answers">
            {question.answers.map((answer) => (
              <div
                key={answer.option}
                className={`test-answer ${selectedAnswer === answer.option ? 'selected' : ''}`}
                onClick={() => handleAnswerClick(answer.option)}
              >
                <p>{answer.option}. {answer.answer}</p>
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
              {selectedAnswer === question.correctAnswer ? "Correct!" : "Incorrect"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Test;
