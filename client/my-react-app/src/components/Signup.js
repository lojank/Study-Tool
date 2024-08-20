import './Signup.css';

function Signup() {
  return (
    <div className="App">
      <img className="icon" src="https://cdn-icons-png.flaticon.com/512/566/566985.png"/>
      <div className="login-con">
      <h1 className="loginAcc">Create an Account</h1>
        
    <div className='names'>
      <input
        type="text"
        placeholder="First Name"
        className="Name-input"
        />
        <input
        type="text"
        placeholder="Last Name"
        className="Name-input"
        />
    </div>
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
        <input
        type="text"
        placeholder="Confirm Password"
        className="Email-input"
        />
        <button className="signInButton">Sign In</button>

      </div>
      <div className="login-img">
       
          <h1 className='new'>Already Have An Account?</h1>
          <h4 className="catchPhrase">Log in and access your study tools</h4>
          <button className="signUp"><a href='/'>Log In</a></button>
      
  
        <img src="https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm0yMThiYXRjaDUtbmluZy0wN18xLmpwZw.jpg" className="App-logo" alt="logo" />
    </div>
    </div>
  );
}

export default Signup;
