import '../style/style.css';
import '../style/drawingPen.css';
import { useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../AppContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const { setLogin, username, setUsername } = useContext(AppContext);
  const [password, setPassword] = useState(''); 
  const [message, setMessage] = useState(''); 
  const [waitForStyle, setWaitForStyle] = useState(false); 

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
    .then(async(res) =>  {
      if(res.ok){
        setWaitForStyle(true); 
        await new Promise(r => setTimeout(r, 2000)); 
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
      {!waitForStyle ? (
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
                  required={true}
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
                  required={true}
                />
              </div>
                <div className='d-flex flex-column text-center mt-3'>
                  <div className='d-flex align-items-center justify-content-between '>
                    <button className='btn btn-primary' type='submit'>Login</button>
                    <Link  to='/register' className='link'onClick={() => setUsername('')}>Sign up</Link>
                  </div>
                </div>
              <div className='display_message text-center' >{'' || <p>{message}</p>}</div>
          </form>
        </div>
      ) : 
        <div className='d-flex align-items-center justify-content-center' style={{'height': '60vh' }} >
          <svg xmlns="http://www.w3.org/2000/svg" height="200px" width="200px" viewBox="0 0 200 200" className="pencil">
            <defs>
              <clipPath id="pencil-eraser">
                <rect height="30" width="30" ry="5" rx="5"></rect>
              </clipPath>
            </defs>
            <circle transform="rotate(-113,100,100)" stroke-linecap="round" stroke-dashoffset="439.82" stroke-dasharray="439.82 439.82" stroke-width="2" stroke="currentColor" fill="none" r="70" className="pencil__stroke"></circle>
            <g transform="translate(100,100)" className="pencil__rotate">
              <g fill="none">
                <circle transform="rotate(-90)" stroke-dashoffset="402" stroke-dasharray="402.12 402.12" stroke-width="30" stroke="hsl(223,90%,50%)" r="64" className="pencil__body1"></circle>
                <circle transform="rotate(-90)" stroke-dashoffset="465" stroke-dasharray="464.96 464.96" stroke-width="10" stroke="hsl(223,90%,60%)" r="74" className="pencil__body2"></circle>
                <circle transform="rotate(-90)" stroke-dashoffset="339" stroke-dasharray="339.29 339.29" stroke-width="10" stroke="hsl(223,90%,40%)" r="54" className="pencil__body3"></circle>
              </g>
              <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
                <g className="pencil__eraser-skew">
                  <rect height="30" width="30" ry="5" rx="5" fill="hsl(223,90%,70%)"></rect>
                  <rect clip-path="url(#pencil-eraser)" height="30" width="5" fill="hsl(223,90%,60%)"></rect>
                  <rect height="20" width="30" fill="hsl(223,10%,90%)"></rect>
                  <rect height="20" width="15" fill="hsl(223,10%,70%)"></rect>
                  <rect height="20" width="5" fill="hsl(223,10%,80%)"></rect>
                  <rect height="2" width="30" y="6" fill="hsla(223,10%,10%,0.2)"></rect>
                  <rect height="2" width="30" y="13" fill="hsla(223,10%,10%,0.2)"></rect>
                </g>
              </g>
              <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
                <polygon points="15 0,30 30,0 30" fill="hsl(33,90%,70%)"></polygon>
                <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)"></polygon>
                <polygon points="15 0,20 10,10 10" fill="hsl(223,10%,10%)"></polygon>
              </g>
            </g>
          </svg>
        </div>
      } 
    </>
  );
}

export default Login;
