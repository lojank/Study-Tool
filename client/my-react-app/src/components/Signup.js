import './Signup.css';
import {useState} from 'react';

function Signup() {

  const [formData, setFormData] = useState({first_name:"", last_name:"", email: "",password: "", confirm_password:""});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert('Passwords do not match')
    } else {
      alert(`First Name: ${formData.first_name}, Last Name: ${formData.last_name}, Email: ${formData.email}, Password: ${formData.password}, Confirm Password: ${formData.confirm_password}`)
    
    }
    ;
  };

  return (
    <div className="App">
      <img className="icon" src="https://cdn-icons-png.flaticon.com/512/566/566985.png"/>
    <form className="login-con" onSubmit={handleSubmit}>
      <h1 className="loginAcc">Create an Account</h1>
        
    <div className='names'>
      <input
        id="first_name" 
        name="first_name"
        type="text"
        placeholder="First Name"
        className="Name-input"
        value={formData.first_name} 
        onChange={handleChange}
        />
        <input
        id="last_name" 
        name="last_name"
        type="text"
        placeholder="Last Name"
        className="Name-input"
        value={formData.last_name} 
        onChange={handleChange}
        />
    </div>
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
        <input
        id="confirm_password" 
        name="confirm_password"
        type="password"
        placeholder="Confirm Password"
        className="Email-input"
        value={formData.confirm_password} 
        onChange={handleChange}
        />
        <button type='submit'className="signInButton">Sign In</button>

      </form>
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
