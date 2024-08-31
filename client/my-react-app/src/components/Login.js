import './Login.css';
import {useState} from 'react';


function Login() {

  const [formData, setFormData] = useState({email: "",password: ""});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Email: ${formData.email}, Password: ${formData.password}`
    );
  };

  return (
    <div className="App">
      <img className="icon" src="https://cdn-icons-png.flaticon.com/512/566/566985.png"/>
      <form className="login-con" onSubmit={handleSubmit}>
      <h1 className="loginAcc">Login To Your Account</h1>
      
        <input
        id="email" 
        name="email"
        type="email"
        placeholder="Email"
        className="Email-input"
        value={formData.email} 
        onChange={handleChange}
        />
        <input
        id="password" 
        name="password"
        type="password"
        placeholder="Password"
        className="Email-input"
        value={formData.password} 
        onChange={handleChange}
        />
        <button type='submit' className="signInButton">Sign In</button>
       </form>
 
      <div className="login-img">
       
          <h1 className='new'>New Here?</h1>
          <h2 className="catchPhrase">Sign up and improve your grades</h2>
          <button className="signUp"><a href="signup">Sign Up</a></button>
      
  
        <img src="https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm0yMThiYXRjaDUtbmluZy0wN18xLmpwZw.jpg" className="App-logo" alt="logo" />
    </div>
    </div>
  );
}

export default Login;
