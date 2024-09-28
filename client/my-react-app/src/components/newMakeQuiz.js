import './newMakeQuiz.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const NewMakeQuiz = () => {
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const arr = ['A', 'B', 'C', 'D', 'E'];
  const navigate = useNavigate();
  const { quizId } = useParams();

  useEffect(() => {
    const fetchQuizData = async () => {
      if (quizId) {
        try {
          const response = await axios.get(`http://localhost:5001/quiz/${quizId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          const { quizTitle, questions } = response.data;

          setQuizName(quizTitle);
          setQuestions(
            questions.map((question) => ({
              id: question.id,
              text: question.questionText,
              choices: question.answers.map(answer => answer.answerText) || ['', ''],
              correctAnswer: question.answerOption, //CHANGE TO answerOption
            }))
          );
        } catch (error) {
          setErrorMessage('Error fetching quiz data. Please try again.');
          console.error('Error fetching quiz data:', error);
        }
      }
    };

    fetchQuizData();
  }, [quizId]);

  const handleQuizNameChange = (event) => {
    setQuizName(event.target.value);
    setErrorMessage('');
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].text = event.target.value;
    setQuestions(newQuestions);
  };

  const handleChoiceChange = (questionIndex, choiceIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices[choiceIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (index, event) => {
    const newQuestions = [...questions];
    const correctAnswer = event.target.value.toUpperCase();
  
    // Update the input field with the user's input
    newQuestions[index].correctAnswer = correctAnswer;
    setQuestions(newQuestions);
  
    // Check if the answer matches one of the available choices
    if (!arr.slice(0, newQuestions[index].choices.length).includes(correctAnswer)) {
      setErrorMessage(`Correct answer must match one of the available choices for Question ${index + 1}`);
    } else {
      setErrorMessage(''); // Clear the error message if the answer is valid
    }
  };
  

  const addNewQuestion = () => {
    const newQuestion = { id: questions.length + 1, text: '', choices: ['', ''], correctAnswer: '' };
    setQuestions([...questions, newQuestion]);
  };

  const addNewChoice = (index) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      if (newQuestions[index].choices.length < arr.length) {
        newQuestions[index].choices.push('');
      }
      return newQuestions;
    });
  };

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

  const handleSave = async () => {
    if (!isFormValid()) {
      setErrorMessage('Please fill out all fields before saving the quiz.');
      return;
    }

    const quizData = {
      title: quizName,
      questions: questions.map((question) => ({
        text: question.text,
        choices: question.choices,
        correctAnswer: question.correctAnswer,
      })),
    };

    try {
      await axios.put(`http://localhost:5001/quiz/${quizId}`, quizData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Quiz updated successfully!');
      navigate('/makeTest');
    } catch (error) {
      setErrorMessage('Error updating quiz. Please try again.');
      console.error('Error updating quiz:', error);
    }
  };

  const isFormValid = () => {
    if (!quizName.trim()) return false;

    for (let question of questions) {
      if (!question.text.trim()) return false;
      for (let choice of question.choices) {
        if (!choice.trim()) return false;
      }
      if (!arr.slice(0, question.choices.length).includes(question.correctAnswer)) {
        setErrorMessage(`Correct answer for Question ${question.id} must match one of the available choices.`);
        return false;
      }
    }

    return true;
  };


  return (
    <div className='quizPage'>
      <nav className='nav'>
        <h2 className="quizName">
          <span className="Quiz">Edit</span> <span className="builder">Quiz</span>
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
                  <span>{index + 1}</span>
                </div>
                <textarea
                  className="question-input"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(index, e)}
                  placeholder="Your Question Here ..."
                />
              </div>

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
                        placeholder={`Add Your Choice ${arr[choiceIndex]}`}
                      />
                      {choiceIndex > 1 && (
                        <img
                        src='https://thumb.ac-illust.com/82/828fbf80368cff42f9de6c0f594bd6eb_t.jpeg'
                    className='xforchoice'
                      alt="Remove"
                      onClick={() => removeChoice(index, choiceIndex)}
                        />
                      )}
                    </div>
                  ))}
                  <div className='wrapChoice'>
                  {question.choices.length < arr.length && (
    <button className='addChoice' onClick={() => addNewChoice(index)}>Add a New Choice</button>
  )}
                  </div>
                </div>
              </div>

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
          <button className='addQues' onClick={addNewQuestion}>Add a New Question</button>
        </div>
        
      </div>
      <div className='adjust'>
      <button className='saveButton1' onClick={handleSave}>
          Save
        </button>
      </div>
      

      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
    </div>
  );
}

export default NewMakeQuiz;



