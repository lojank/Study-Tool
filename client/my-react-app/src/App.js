import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './components/homePage';
import MakeTest from './components/makeTest';
import MakeQuiz from './components/makeQuiz';
import Test from './components/Test'

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/homePage" element={<HomePage />} />
          <Route path="/makeTest" element={<MakeTest />} />
          <Route path="/makeQuiz" element={<MakeQuiz />} />
          <Route path="/quiz/:quizId" element={<Test />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;