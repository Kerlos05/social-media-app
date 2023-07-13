import { BrowserRouter, Routes, Route, Outlet, Link, useNavigate } from "react-router-dom";
import '../style/style.css'
import Register from "./register";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";


const Login = ({setLogin, username, setUsername }) => {
  const [password, setPassword] = useState(''); 
  const [message, setMessage] = useState(''); 

  const handleSub = async(e) => {
    e.preventDefault();
    await fetch('http://localhost:8080/auth', {
      method: 'POST',
      headers:{
        'content-type': 'application/json'
      }, 
      body: JSON.stringify({
        username: username, 
        password: password 
      })
    })
    .then(res =>  {
      if(res.ok){
        setLogin(true); 
      }   else{
        return res.json().then(data => {
          setMessage(data.message);
        });
      }
    })
  }
  return (
    <>
      <div className='loginContainer d-flex align-items-center justify-content-center'>
          <div className='image'>
            <FontAwesomeIcon icon={faUser} className='userIcon' />
          </div>
          <form className='d-grid align-items-center justify-content-center' onSubmit={handleSub}>
              <div className='mb-3 input-group'>
                <span className='input-group-text'><FontAwesomeIcon icon={faUser} className='text-light'/></span>
                <input 
                  type='text'
                  className='form-control'
                  placeholder='Username' 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
              <div className='mb-3 input-group'>
                <span className='input-group-text'><FontAwesomeIcon icon={faLock} className='text-light'/></span>
                <input 
                  type='password' 
                  className='form-control ' 
                  placeholder='Password' 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
                <div className='d-flex flex-column text-center mt-3'>
                <div className='d-flex align-items-center justify-content-between '>
                  <button className='btn btn-primary' type='submit'>Login</button>
                  <Link  to='/register' className='link'>Sign up</Link>
                </div>
              </div>
              <div className='display_message text-center'>{'' || <p>{message}</p>}</div>
          </form>
        </div>
    </>
  );
}

export default Login;
