import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="login-img">
      <img src="https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm0yMThiYXRjaDUtbmluZy0wN18xLmpwZw.jpg" className="App-logo" alt="logo" />
      </div>
      <div className="login-con">

      <header className="App-header">
        <h1 className>New Here?</h1>
        <p>
          Email
        </p>
        <input
        type="text"
        placeholder="Enter your email address or username"
        className="Email-input"
        />
        <p>
          Password
        </p>
        <input
        type="text"
        placeholder="Enter your password"
        className="Email-input"
        />
        
      </header>
      </div>
    </div>
  );
}

export default App;
