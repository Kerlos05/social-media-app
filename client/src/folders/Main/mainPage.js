import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import Header from './header';
import LeftSide from './leftSide';
import RightSide from './rightSide';
import SendPost from './sendPost';
import Feed from './feed';
import '../../style/mainPage.css'; 

const MainPage = ({username, setUsername}) => {
    username = 's'; 
    return (
        <>
           <div className='mainPage p-2'>
                <div className='header'>
                    <Header username= {username} setUsername= {setUsername}/>
                </div>
                <div className='mainContent d-flex '>
                    {/* <LeftSide username={username}/> */}
                    {/* <RightSide username={username}/> */}
                    {/* <SendPost username={username}></SendPost> */}

                    <Feed username={username}></Feed>

                </div>
           </div>
        </>
    )
}

export default MainPage; 