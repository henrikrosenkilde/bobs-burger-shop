import { useContext, useState } from 'react'
import FormInput from './FormInput'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { LoggedInCtx } from '../../App';

function LoginForm() {
    const {loggedIn, setLoggedIn} = useContext(LoggedInCtx)
    const [form, setForm] = useState({
        email: "", 
        password: "",
    })
    const navigate = useNavigate();

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      // Check if required fields are empty
      if (!form.email || !form.password) {
        alert('Please fill out all required fields.');
        return;
      }

      const authUser = {email: form.email, password: form.password}
      try {
          const response = await axios.post('https://localhost:7141/auth/login', authUser)
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("userId", response.data.id)
          setLoggedIn(true)
          navigate("/")
      } catch(e) {
          if (e.response.data.length > 1) {
              alert(e.response.data[1].description)
          } else if (e.response.data[0].description) {
              alert(e.response.data[0].description)
          } else {
            alert("User does not exist")
          }
          return;
      }
      
    };

  return (
    <div>
      <h1>Login</h1>
        <form className="user-info-form" onSubmit={handleSubmit}>
            <FormInput type="email" name="Email" value={form.email} onChange={handleChange} required />
            <FormInput className="password" type={'password'} name="Password" value={form.password} onChange={handleChange} required />
            <div className="succ-button-container">
            <button type="submit" className="cm-button" style={{ height: '50px' }}>
              Login
            </button>
    </div>
        </form>
        <p>Don't have a user? Register <Link to="/register">here.</Link></p>
    </div>
  )
}

export default LoginForm
