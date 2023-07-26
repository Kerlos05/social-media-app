import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from "react";
import Header from './header';
import '../../style/mainPage.css'; 
import { getAllPosts, getFriends, getImage, handleLogout } from '../../actions';
import { useContext } from "react";
import { AppContext } from "../../AppContext";
import defaultAvatar from '../../image/avatar.png'; 
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
import DeleteUser from './deleteUser';
const socket = io('http://localhost:4500');

const Settings = () => {
    const context = useContext(AppContext);
    const {
        userContent, 
        commentStates, 
        setRecivedPost, 
        showUserPage, 
        setAddedFriends, 
        setUserContent,
        setCommentStates, 
        username, 
        addedFriends, 
        recivedPost,
        setLogin,  
        setUsername,
        avatar
    } = context; 

    const navigate = useNavigate(); 
    const [message, setMessage] = useState('');
    const [newAvatar, setNewAvatar] = useState(''); 
    const [newUsername, setNewUsername] = useState('');
    const fileInputRef = useRef(null); 



    const toBase64 = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new FileReader();
      
        reader.onload = () => {
          setNewAvatar(reader.result);
        };
      
        reader.onerror = (err) => {
          console.log(err);
        };
      
        if (file) {
          const blob = new Blob([file], { type: file.type });
          reader.readAsDataURL(blob);
        }
    };
      
    const handleSub = async(e) => {
        e.preventDefault();
        if(newUsername.length > 8 || newUsername.length < 4){
            setMessage('Username must be between 4 and 8 characters'); 
            return ; 
        }

        await fetch('http://localhost:8080/edit-profile', {
            method: 'PUT',
            crossDomain: true, 
            headers: {
            'content-type': 'application/json', 
            Accept: 'application/json', 
            'Access-Control-Allow-Origin': '*', 
            },
            body: JSON.stringify({
                user: newUsername,
                newAvatar: newAvatar,
                oldUsername: username, 
                oldAvatar: avatar
            })
        })
        .then((res) => {
            if (res.ok) {
                handleLogout(username);
                navigate('/');
                setLogin(false);
                setUsername('');
                socket.emit('updatePostUI', username);
                socket.emit('updateFriendUI', username);
                socket.emit('updateMessagetUI', username);
            }   else{
                res.json().then((data) => {
                    console.log(data);
                    return setMessage(data.message);
                }) 
            }

        })
        .catch((error) => {
            setMessage('Something went wrong. Please try again.');
        });
          
    }

    const resetForm = (e) => {
        e.preventDefault();
        setNewAvatar('');
        setNewUsername('');
        setMessage(''); 
        fileInputRef.current.value = null; 
    };


    return (
        <div className='container-fluid p-2 '>
            <div className='header'>
                <Header context={context}/>
            </div>
            <div className=' d-flex flex-column p-3 w-100 mt-5 mb-5' style={{position: 'unset', borderTop: '1px solid black', borderBottom: '1px solid black'}}>   
                <div className='w-50 mt-3 mb-3'>
                <form onSubmit={handleSub}>
                <div className='d-flex justifyalign-items-center'>
                    <div>
                        <label htmlFor="fileInput">
                            <input
                                accept="image/*"
                                type="file"
                                id="fileInput"
                                onChange={toBase64}
                                style={{ display: 'none' }}
                                ref={fileInputRef} 
                            />
                            {newAvatar == '' || newAvatar == null ? (
                                <img src={avatar} alt="Default Avatar" className='fullWidth' />
                            ) : (
                                <img src={newAvatar} alt="Selected Image" className='fullWidth' />
                            )}
                        </label>
                    </div>
                    <div className='mb-2 mt-4 ms-4 input-group'>
                        <input 
                            type='text'
                            className='form-control'
                            placeholder='Update username'
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                            }}
                            value={newUsername}
                            onChange={e => setNewUsername(e.target.value)}
                        />
                       
                    </div>
                </div>
                <p className='text-center mt-3 mb-3'>{message}</p>
                    <div className='d-flex justify-content-around w-100 mt-5'>
                        <button className='btn btn-primary w-50 me-3' type='submit'>Update</button>
                        <button 
                            className='btn btn-primary w-50'
                            onClick={resetForm}
                        >
                            Reset</button>
                    </div>
            </form>
                </div>
            </div>
            <div className='d-flex mt-5 p-3'> 
                <DeleteUser />
            </div>
        </div>
    )
}

export default Settings; 



/* 
  <form onSubmit={handleSub}>
                    <div>
                        <label htmlFor="fileInput">
                            <input
                                accept="image/*"
                                type="file"
                                id="fileInput"
                                onChange={toBase64}
                                style={{ display: 'none' }}
                                ref={fileInputRef} 
                            />
                            {newAvatar == '' || newAvatar == null ? (
                                <img src={avatar} alt="Default Avatar" className='fullWidth' />
                            ) : (
                                <img src={newAvatar} alt="Selected Image" className='fullWidth' />
                            )}
                        </label>
                    </div>
                    <div className='mb-2 mt-4 input-group'>
                        <span className='input-group-text'><FontAwesomeIcon icon={faUser} className='text-light'/></span>
                        <input 
                            type='text'
                            className='form-control'
                            placeholder='Username' 
                            value={newUsername}
                            onChange={e => setNewUsername(e.target.value)}
                        />
                       
                    </div>
                    {message}
                    <div className='d-flex justify-content-between'>
                        <button className='btn btn-primary' type='submit'>Update</button>
                        <button 
                            className='btn btn-primary'
                            onClick={resetForm}
                        >
                            Reset</button>
                    </div>
                </form>
*/