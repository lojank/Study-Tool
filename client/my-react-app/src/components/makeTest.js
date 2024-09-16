import './makeTest.css';

function MakeTest() {
    return (
      <div className='Page'>
        <nav className='nav'>
        <h2 className="webName">
            <span className="quiz">Quiz</span> <span className="shuffle">Shuffle</span>
        </h2>
          <button className='log'>Log Out</button>
          <img className="iconPic" src="https://cdn-icons-png.flaticon.com/512/566/566985.png"/>
        </nav>
        <h3 className="quizName"> My Quizzes</h3>

        <div className="plusBox">
        <img src="https://wumbo.net/symbols/plus/feature.png" className='plusIcon' alt=""></img>
        <span className="add-new-quiz">Add a new Quiz</span>
        </div>

      </div>
    );
}

export default MakeTest;