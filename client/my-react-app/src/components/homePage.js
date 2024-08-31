import './homePage.css';

function HomePage() {
    return (
      <div className='homePage'>
        <nav className='navbar'>
          <h1 className='title'>StudyNote</h1>
          <button className='logIn'>Log in</button>
        </nav>
        <div className='buttonName'>
          <h1 className='phrase'>How do you want to study?</h1>
          <h3 className='name'>Master whatever you’re learning with Quizlet’s interactive flashcards, practice tests, and study activities.</h3>
          <button className='signUp'>Sign Up For Free</button>
        </div>
      </div>
    );
}

export default HomePage;