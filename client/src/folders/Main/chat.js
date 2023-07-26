import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from "react";
import Header from './header';
import '../../style/mainPage.css'; 
import deleteUser from '../../image/delete-user.png'; 
import { getFriends, handleDeletefriend, deleteMessage, sendNewMessage, getAllMessages } from '../../actions';
import { useContext } from "react";
import { AppContext } from "../../AppContext";
import { Dropdown } from 'react-bootstrap';

import io from 'socket.io-client'
const socket = io('http://localhost:4500');

const Chat = () => {
    const context = useContext(AppContext);
    
    const [sendMessage, setSentMessages] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [activeFriend, setActiveFriend] = useState('');
    const {addedFriends, setAddedFriends, username} = context;
    
    const activeFriendRef = useRef(activeFriend);
    

    
    useEffect(() => {
        activeFriendRef.current = activeFriend;
      }, [activeFriend]);

    useEffect(() => {
        getFriends(setAddedFriends, username); 
    }, []); 


    const handleClickFriend = async(friend) => {
        getAllMessages(username, friend, setReceivedMessages); 
    };

    function handleCopy(content){
        console.log(content);
        navigator.clipboard.writeText(content); 
    }

    const handleDeleteMessage = (messageContent, index) => {
        deleteMessage(username, activeFriend, messageContent, setReceivedMessages, index); 
    }


    const deleteFrind = async (friend) => {
        const updatedActiveFriend = '';
        setActiveFriend(updatedActiveFriend);
        handleDeletefriend(friend, setAddedFriends, username, setReceivedMessages); 
        socket.emit('updateFriendUI', friend); 
    }

    
    const handleSendMessage = (e) => {
        e.preventDefault();
        if(!activeFriend || sendMessage === ''){
            return ; 
        }

        sendNewMessage(username, sendMessage, activeFriend, setReceivedMessages); 
        setSentMessages(''); 
        socket.emit('updateMessageUI', username);     

    }


    useEffect(() => {
        socket.on('updateFriend', async(userToUpdate) => {
            await new Promise(r => setTimeout(r, 1000)); 
            getFriends(setAddedFriends, username); 
            setActiveFriend(''); 
        })

        socket.on('updateMessage', async(userToUpdate) => {
            if(userToUpdate !== activeFriendRef.current){
                return; 
            }
            await new Promise(r => setTimeout(r, 600)); 
            getAllMessages(username, userToUpdate, setReceivedMessages); 
        })

        return () => {
            socket.off('updateFriend'); 
            socket.off('updateMessage'); 
        }
    }, [socket]);

    return(
        <div className='p-2 container-fluid'>
            <div className='header'>
                <Header context={context}/>
            </div>
            <div className='mt-4 chatContainer container-fluid ' >
                <div className='text-bg-primary p-3 resizAble mb-2' >
                    <div>
                        {addedFriends.length > 0 ? (
                           addedFriends[0] === undefined ? '': 
                            addedFriends[0].map((friend, index) => (
                                <div
                                key={index}
                                className={`d-flex justify-content-between align-items-center p-2 mb-3 ${friend === activeFriend ? 'active' : ''}`}
                                onClick={(e) => {
                                    handleClickFriend(friend);
                                    setActiveFriend(friend);
                                }}
                                onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    setActiveFriend('');
                                }}
                                >
                                <p style={{ margin: '0', padding: '5px', wordBreak: 'break-word' }}>
                                    {friend}
                                </p>
                                <button
                                    className='btn ms-2'
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    deleteFrind(friend);
                                    }}
                                >
                                    <img src={deleteUser} alt='avatar' />
                                </button>
                                </div>
                            ))
                        ) : (
                        ''
                        )}
                    </div>
                </div>
                <main className=' p-3 bg-primary d-flex justify-content-between flex-column mainChat' >
                    <section className='bg-white p-3 h-100' style={{overflow: 'auto', borderTopRightRadius: '5px', borderBottomRightRadius : '5px'}} >
                        {activeFriend !== '' && receivedMessages
                        .filter((name) => name[0] === activeFriend)
                        .map((item, index) => {
                            return (
                                <div key={index} className='d-flex align-items-start justify-content-between mb-3 text-break p-3 bg-light'>
                                  <p className='mt-1 '> {item[1]}</p>
                                  <div className='d-flex gap-3 ms-3'>
                                    <Dropdown>
                                      <Dropdown.Toggle variant="secondary" id={`dropdown-${index}`} >
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleDeleteMessage(item, index)}>
                                          <FontAwesomeIcon icon={faTrash} /> Delete
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleCopy(item[1])}>
                                          <FontAwesomeIcon icon={faCopy} /> Copy
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </div>
                              );
                            })}
                    </section>
                    <footer >
                        <form className='d-flex w-100 mt-4' onSubmit={handleSendMessage}>
                            <input 
                                placeholder='Type your message' 
                                className='form-control' 
                                value={sendMessage} 
                                onChange={e => setSentMessages(e.target.value)}
                            />
                            <button type='submit' className='btn btn-dark'>Send</button>
                        </form>
                    </footer>
                </main>       
            </div>
        </div>
    )

}

export default Chat; 
