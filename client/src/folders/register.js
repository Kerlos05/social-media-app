import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import avatar from '../image/avatar.png'; 

const Register = () => {
  const [newUsername, setNewUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [message, setMessage] = useState(''); 
  const [image, setImage] = useState(''); 

  
  const navigate = useNavigate(); 

  const toBase64 = (e) => {
    e.preventDefault();
    var reader = new FileReader; 
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage(reader.result); 
    } 
    reader.onerror = (err) => {
      console.log(err);
    }
  }

  const handleSub = async(e) => {
    e.preventDefault();
    if(newUsername.length > 8 || newUsername.length < 4){
      setMessage('Username must be between 4 and 8 characters'); 
      return ; 
    } else if(password.length > 8 || password.length < 4){
      setMessage('Passowrd must be between 4 and 8 characters'); 
      return ; 
    }
    await fetch('http://localhost:8080/register', {
      method: 'POST',
      crossDomain: true, 
      headers: {
        'content-type': 'application/json', 
        Accept: 'application/json', 
        'Access-Control-Allow-Origin': '*', 
      },
      body: JSON.stringify({
        user: newUsername, 
        pwd: password,
        base64: image || avatar
      })
    })
    .then(res =>  {
      if(res.ok){
        navigate('/'); 
        setImage(''); 
        setNewUsername('')
      } else{
        return res.json().then(data => {
          setMessage(data.message);
        });
      }
    })
  }

  return (
    <>
      <div className='loginContainer d-flex align-items-center justify-content-center'>
        <form onSubmit={handleSub}>
          <div className="iconSection">
            <label htmlFor="fileInput">
              <input
                accept="image/*"
                type="file"
                id="fileInput"
                onChange={toBase64}
                style={{ display: 'none' }}
              />
              {image == '' || image == null ? (
                <img width={175} height={175} src={avatar} alt="Default Avatar" />
              ) : (
                <img width={175} height={175} src={image} alt="Selected Image" />
              )}
            </label>
          </div>
          <div className='mb-3 input-group'>
            <span className='input-group-text'><FontAwesomeIcon icon={faUser} className='text-light'/></span>
            <input 
              type='text'
              className='form-control'
              placeholder='Username' 
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              required
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
              required
            />
          </div>
          <div className='d-flex flex-column text-center mt-4'>
              <div className='d-flex align-items-center justify-content-between '>
                <button className='btn btn-primary' type='submit'>Sign up</button>
                <Link  to='/' className='link'>Login</Link>
              </div>
            </div>
          <div className='display_message text-center'>{'' || <p>{message}</p>}</div>
        </form>
      </div>
    </>
  )
  
}

export default Register;
  