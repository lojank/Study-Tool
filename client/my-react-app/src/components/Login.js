import './Login.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State to hold error messages
  const [success, setSuccess] = useState(""); // State to hold success messages

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset error state
    setSuccess(""); // Reset success state

    try {
      const response = await fetch('http://localhost:5001/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT token in localStorage
        localStorage.setItem('token', data.token);

        alert('Login successful! Redirecting...');
        navigate('/makeTest');
        // Optionally, handle successful login (e.g., redirect or save token)
        // window.location.href = '/dashboard'; // Example redirection
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h2 className="webName1">
          <span className="quiz1">Quiz</span> <span className="shuffle1">Shuffle</span>
        </h2>
      <img className="icon10" src="https://cdn-icons-png.flaticon.com/512/566/566985.png" alt="Login Icon"/>
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

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>

      <div className="login-img">
        <h1 className='new'>New Here?</h1>
        <h2 className="catchPhrase">Sign up and improve your grades</h2>
        <button className="signUp">
          <a className='signUpcolour'href="/signup">Sign Up</a>
        </button>

        <img
          src="https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm0yMThiYXRjaDUtbmluZy0wN18xLmpwZw.jpg"
          className="App-logo"
          alt="Decorative Logo"
        />
      </div>
    </div>
  );
}

export default Login;

