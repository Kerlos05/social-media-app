import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faMessage, faBell, faSun } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { handleLogout, handleFriend, getFriends } from '../../actions';
import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
const socket = io('http://localhost:4500');


const Header = ({context}) => {
    const { username, setAddedFriends } = context;
    const navigate = useNavigate(); 
    const [timeoutId, setTimeoutId] = useState(null);


    const handleDropdownSelect = (eventKey) => {
        if(eventKey === 'settings') {
            navigate('/settings') ; 
        }
        if (eventKey === 'logout') {
            handleLogout(username);
            navigate('/') ; 
            window.location.reload(); 
        }
    };

    const handleSub = async(e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const enteredValue = formData.get(`addFriend`);

        if(enteredValue ===  username){
            return ; 
        }
        e.target.reset(); 

        await handleFriend(enteredValue, setAddedFriends, username); 
        socket.emit('updateFriendUI', enteredValue); 
    }


    useEffect(() => {
        socket.on('updateFriend', async(userToUpdate) => {
            if(userToUpdate !== username){
                return ; 
            }
            await new Promise(r => setTimeout(r, 1000)); 
            getFriends(setAddedFriends, userToUpdate); 
        })

        return () => {
            socket.off('updateFriend'); 
        }
    }, [socket]);

    const handleDeleteUser = async() => {
        let interval = 0; 
        const newTimeoutId = setTimeout(() => {
            navigate('/deleteUser'); 

        }, 1700); 
        setTimeoutId(newTimeoutId);

    }

    const handleMouseLeave = () => {
        clearTimeout(timeoutId);
    };

    const handleUserClick = () => {
        clearTimeout(timeoutId);
        navigate('/deleteUser'); 
    }


    return(
        <>
            <header className="d-flex justify-content-between align-items-center p-3 text-bg-primary">
                <div className='d-flex align-items-center gap-5 ' >
                <a
                    style={{
                        fontSize: '32px',
                        color: 'aliceblue',
                        textDecoration: 'none',
                        cursor: 'pointer',
                    }}
                    onClick={(e) => {
                        navigate('/main')
                    }}
                >
                    Chatopia
                </a>
                    
                    <form onSubmit={handleSub}>
                        <input 
                            className='white-placeholder'
                            placeholder='Add friend ?' 
                            name='addFriend'
                            style={{
                                border: '0px',
                                outline: 'none',
                                backgroundColor: 'transparent',
                                borderBottom: '1px solid white',
                                color: 'white'
                            }}
                        />
                    </form>
                </div>
                <div className='ms-3 d-flex align-items-center header'>
                    <FontAwesomeIcon icon={faMessage} className='p-2 me-4' style={{'cursor':'pointer','transform':'scale(160%)'}} onClick={() => navigate('/chat')}/>
                        <DropdownButton  
                            className="p-2"
                            variant='light' 
                            title={username} 
                            id="dropdown-basic-button" 
                            onSelect={handleDropdownSelect}
                        >
                            <Dropdown.Item eventKey="settings">Settings</Dropdown.Item>
                            <Dropdown.Item eventKey="logout">Logout</Dropdown.Item>
                        </DropdownButton>
                </div>
            </header>
        </>
    ); 
}


export default Header; 