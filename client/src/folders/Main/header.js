import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faMessage, faBell, faSun } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const Header = ({username}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const changeTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleDropdownSelect = (eventKey) => {
    if (eventKey === 'settings') {


    } else if (eventKey === 'logout') {
        // we shall send the username to the server so that we can log him out 
        // window.location.reload(); 
    }
  };
    return(
        <>
            <header className="bg-danger d-flex justify-content-between align-items-center p-3" >
                <div>
                    <h1>Chatopia</h1>
                </div>
                <div className='d-flex align-items-center'>
                    <FontAwesomeIcon  icon={isDarkMode ? faSun : faMoon } className='p-2 me-4' style={{'cursor':'pointer','transform':'scale(160%)'}} onClick={changeTheme}/>
                    <FontAwesomeIcon icon={faMessage} className='p-2 me-4' style={{'cursor':'pointer','transform':'scale(160%)'}}/>
                    <FontAwesomeIcon icon={faBell} className='p-2 me-4' style={{'cursor':'pointer','transform':'scale(160%)'}}/>
                    <DropdownButton className="p-2" title={username } id="dropdown-basic-button" onSelect={handleDropdownSelect}>
                        <Dropdown.Item eventKey="settings">Settings</Dropdown.Item>
                        <Dropdown.Item eventKey="logout">Logout</Dropdown.Item>
                    </DropdownButton>
                </div>
            </header>
        </>
    ); 
}


export default Header; 