import './makeQuiz.css';
import React from 'react';

function MakeQuiz() {
    const [questions, setQuestions] = React.useState([{id: 1, choices: ['A', 'B']}]);
    function AddNewQuestion() {
        const newQuestions = { id: questions.length + 1, choices: ['A', 'B'] };
        setQuestions(prevQuestions => {
            return [...prevQuestions,newQuestions]
    }) 
        
    }
    const removeQuestion = (indexToRemove) => {
        const newQuestions = questions.filter((_, index) => index !== indexToRemove);
        setQuestions(newQuestions);
    };
    
    
    const [choices, setChoices] = React.useState(['A','B']);
    function AddNewChoice(index) {
        const alp = ['A', 'B', 'C', 'D', 'E'];
        setQuestions(prevQuestions => {
            const newQuestions = [...prevQuestions];
            const currentChoices = newQuestions[index].choices;
            if (currentChoices.length < alp.length) {
                newQuestions[index].choices = [...currentChoices, alp[currentChoices.length]];
            }
            return newQuestions;
        });
    }

        
    
    const ch = ['first','second','third','fourth','fifth'];
    return (
      <div className='quizPage'>
        <nav className='nav'>
        <h2 className="quizName">
            <span className="Quiz">Quiz</span> <span className="builder">Builder</span>
        </h2>
          <button className='saveButton'>Save</button>
          <img className="iconPic" src="https://cdn-icons-png.flaticon.com/512/566/566985.png"/>
        </nav>

        <div className="container">
            <div className="badge">1</div>
            <span className="label">Quiz Name: </span>
            <input
            className="input"
            placeholder="Enter the Name of the quiz..."
        />
    
</div>

        <div className="container2">
            <div className='wrapper'>
            <div className="badge2">2</div>
            <span className="label2">Quiz Questions: </span>
            </div>
        {questions.map((question,index) =>(
            <div>
            <div className="question-container">
        <div className='wrap'>        
        <div className="question-label">
          <span>Question </span>
          <span>{question.id}</span>
        </div>
        <textarea
          className="question-input"
          placeholder="Your Question Here ..."
        />
        </div>
        

        {(questions.length-1 === index) && <img
            src='https://thumb.ac-illust.com/82/828fbf80368cff42f9de6c0f594bd6eb_t.jpeg'
            className='xButton'
            alt="Remove"
            onClick={() => removeQuestion(index)}
        />}
        <div className='wrap2'>
        <div className="choices-label">
          <span>Choices </span>
        </div>
        
        <div className='choiceCon'>
            
            {question.choices.map((choice, choiceIndex) => (
            <div className='now'>
            <span className='labelA'>{choice}:</span>
            <input
              className="choice-input2"
              placeholder={`Add Your ${ch[choiceIndex]} Choice`}
            />
            </div>
            ))}
            <div className='wrapChoice'>
            <button className='addChoice' onClick={() => AddNewChoice(index)}>Add a New Choice</button>

            </div>
        
  
        </div>
            
        </div>

        {(questions.length-1 == index) && <img
            src='https://thumb.ac-illust.com/82/828fbf80368cff42f9de6c0f594bd6eb_t.jpeg'
            className='xButton'
            alt="Remove"
            onClick={() => removeQuestion(index)}
        />}
        
    
        
       </div>

      

    </div>

    
    
    

        ))}
            
    <div className='addButton'>
        <button className='addQues' onClick={AddNewQuestion}>Add a New Question</button>
    </div>
    
        </div>

      </div>
    );
}


export default MakeQuiz;