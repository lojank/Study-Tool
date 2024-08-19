import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <img className="icon" src="https://cdn-icons-png.flaticon.com/512/566/566985.png"/>
      <div className="login-con">
      <h1 className="loginAcc">Login To Your Account</h1>
        
        <input
        type="text"
        placeholder="Email"
        className="Email-input"
        />
        <input
        type="text"
        placeholder="Password"
        className="Email-input"
        />
        <button className="signInButton">Sign In</button>

      </div>
      <div className="login-img">
       
          <h1 className='new'>New Here?</h1>
          <h2 className="catchPhrase">Sign up and improve your grades</h2>
          <button className="signUp">Sign Up</button>
      
  
        <img src="https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm0yMThiYXRjaDUtbmluZy0wN18xLmpwZw.jpg" className="App-logo" alt="logo" />
        </div>
    </div>
  );
}

export default App;
