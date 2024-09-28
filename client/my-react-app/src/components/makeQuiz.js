import './makeQuiz.css';
import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function MakeQuiz() {
  const [quizName, setQuizName] = React.useState('');
  const [questions, setQuestions] = React.useState([{ id: 1, text: '', choices: ['', ''], correctAnswer: '' }]);
  const [errorMessage, setErrorMessage] = React.useState(''); // State to manage error messages
  const arr = ['A', 'B', 'C', 'D', 'E'];
  const navigate = useNavigate();

  function handleQuizNameChange(event) {
    setQuizName(event.target.value);
    setErrorMessage(''); // Clear error message on input change
  }

  function handleQuestionChange(index, event) {
    const newQuestions = [...questions];
    newQuestions[index].text = event.target.value;
    setQuestions(newQuestions);
    setErrorMessage(''); // Clear error message on input change
  }

  function handleChoiceChange(questionIndex, choiceIndex, event) {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices[choiceIndex] = event.target.value;
    setQuestions(newQuestions);
    setErrorMessage(''); // Clear error message on input change
  }

  function handleCorrectAnswerChange(index, event) {
    const newQuestions = [...questions];
    newQuestions[index].correctAnswer = event.target.value.toUpperCase(); // Ensure the input is in uppercase
    setQuestions(newQuestions);
    setErrorMessage(''); // Clear error message on input change
  }

  function AddNewQuestion() {
    setErrorMessage(''); // Clear error message on input change
    const newQuestions = { id: questions.length + 1, text: '', choices: ['', ''], correctAnswer: '' };
    setQuestions((prevQuestions) => [...prevQuestions, newQuestions]);
  }

  function AddNewChoice(index) {
    setErrorMessage(''); // Clear error message on input change
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      const currentChoices = newQuestions[index].choices;
      if (currentChoices.length < arr.length) {
        newQuestions[index].choices = [...currentChoices, ''];
      }
      return newQuestions;
    });
  }

  const removeQuestion = (indexToRemove) => {
    const newQuestions = questions.filter((_, index) => index !== indexToRemove);
    setQuestions(newQuestions);
  };

  const removeChoice = (questionIndex, choiceIndex) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions[questionIndex].choices = newQuestions[questionIndex].choices.filter((_, index) => index !== choiceIndex);
      return newQuestions;
    });
  };


  function handleSave() {
    if (!isFormValid()) {
      setErrorMessage('Please fill out all fields and provide valid answers before saving the quiz.');
      return;
    }
  
    // Clear error message when form is valid
    setErrorMessage('');
  
    const quizData = {
      title: quizName,
      questions: questions.map(question => ({
        text: question.text,
        choices: question.choices,
        correctAnswer: question.correctAnswer
      }))
    };
  
    // Send the quiz data to the backend
    axios.post('http://localhost:5001/quiz', quizData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming the token is stored in localStorage
      }
    })
    .then(response => {
      alert('Quiz saved successfully!');
      navigate('/makeTest');
    }) 
    .catch(error => {
      setErrorMessage('Error saving quiz. Please try again.');
      console.error('Error saving quiz:', error);
    });
  }
  


// Validation function to check if all fields are filled and correct answer is valid
function isFormValid() {
  if (!quizName.trim()) return false; // Check if quiz name is filled

  for (let question of questions) {
    if (!question.text.trim()) return false; // Check if question text is filled
    
    // Check if every choice is filled
    for (let choice of question.choices) {
      if (!choice.trim()) return false;
    }

    // Ensure correct answer is within the bounds of available choices
    const correctAnswerIndex = arr.indexOf(question.correctAnswer);
    if (correctAnswerIndex === -1 || correctAnswerIndex >= question.choices.length) {
      setErrorMessage(`Correct answer for Question ${question.id} must match one of the available choices (A, B, C, D, or E).`);
      return false;
    }
  }

  return true;
}


  const ch = ['first', 'second', 'third', 'fourth', 'fifth'];

  return (
    <div className='quizPage'>
      <nav className='nav'>
        <h2 className="quizName">
          <span className="Quiz">Quiz</span> <span className="builder">Builder</span>
        </h2>``
        <button
          className='saveButton'
          onClick={handleSave}
        >
          Save
        </button>
        <img className="iconPic" src="https://cdn-icons-png.flaticon.com/512/566/566985.png" alt="icon" />
      </nav>

      <div className="container">
        <div className="badge">1</div>
        <span className="label">Quiz Name: </span>
        <input
          className="input"
          value={quizName}
          onChange={handleQuizNameChange}
          placeholder="Enter the Name of the quiz..."
        />
      </div>

      <div className="container2">
        <div className='wrapper'>
          <div className="badge2">2</div>
          <span className="label2">Quiz Questions: </span>
        </div>
        {questions.map((question, index) => (
          <div key={index}>
            <div className="question-container">
              <div className='wrap'>
                <div className="question-label">
                  <span>Question </span>
                  <span>{index+1}</span>
                </div>
                <textarea
                  className="question-input"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(index, e)}
                  placeholder="Your Question Here ..."
                />
              </div>

              {/* Render the delete button for all questions except the first one */}
              {index > 0 && (
                <img
                  src='https://thumb.ac-illust.com/82/828fbf80368cff42f9de6c0f594bd6eb_t.jpeg'
                  className='xButton'
                  alt="Remove"
                  onClick={() => removeQuestion(index)}
                />
              )}
              
              <div className='wrap2'>
                <div className="choices-label">
                  <span>Choices </span>
                </div>

                <div className='choiceCon'>
                  {question.choices.map((choice, choiceIndex) => (
                    <div className='now' key={choiceIndex}>
                      <span className='labelA'>{arr[choiceIndex]}:</span>
                      <input
                        className="choice-input2"
                        value={choice}
                        onChange={(e) => handleChoiceChange(index, choiceIndex, e)}
                        placeholder={`Add Your ${ch[choiceIndex]} Choice`}
                      />
                      {/* Render delete button for choices except A and B */}
                      {choiceIndex > 1 && (
                        <button className='deleteChoice' onClick={() => removeChoice(index, choiceIndex)}>Delete</button>
                      )}
                    </div>
                  ))}
                  <div className='wrapChoice'>
                    <button className='addChoice' onClick={() => AddNewChoice(index)}>Add a New Choice</button>
                  </div>
                </div>
              </div>

              {/* Input for Correct Answer */}
              <div className='wrap5'>
                <div className="question-label5">
                  <span>Correct Answer</span>
                </div>
                <input
                  className="question-input5"
                  value={question.correctAnswer}
                  onChange={(e) => handleCorrectAnswerChange(index, e)}
                  placeholder="Add The Correct Answer Here ... EX: A, B, C, D, E"
                />
              </div>
            </div>
          </div>
        ))}

        <div className='addButton'>
          <button className='addQues' onClick={AddNewQuestion}>Add a New Question</button>
        </div>
      </div>

      {/* Display error message if form is not valid */}
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
    </div>
  );
}

export default MakeQuiz;