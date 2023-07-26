import { useState, useEffect } from "react";
import Header from './header';
import LeftSide from './leftSide';
import RightSide from './rightSide';
import SendPost from './sendPost';
import Feed from './feed';
import '../../style/mainPage.css'; 
import { getAllPosts, getFriends, getImage, handleLogout } from '../../actions';
import { useContext } from "react";
import { AppContext } from "../../AppContext";

const MainPage = () => {
    const context = useContext(AppContext);
    const { setAddedFriends, username, setRecivedPost, setUserContent, setAvatar} = context;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    window.addEventListener('resize', async() => {
        setWindowWidth(() => window.innerWidth);
    });
  
    useEffect(() => {
        getFriends(setAddedFriends, username);
        getAllPosts(setRecivedPost, setUserContent);
        getImage(username, setAvatar);
    }, []);

    useEffect(() => {
        window.addEventListener('beforeunload', () => {
            console.log('called');
            handleLogout(username);
        });
    }, []);

    return (
        <>
            <div className='mainPage p-2 container-fluid'>
                <div className='header'>
                    <Header context={context}/>
                </div>
                <div className='mainContent d-flex flex-row justify-content-between mt-3'>
                    {windowWidth < 1023 ? (
                        <>
                            <LeftSide context={context} />
                            <RightSide context={context} />
                            <div className='centerContent'>
                                <SendPost context={context} />
                                <Feed context={context} />
                            </div>
                        </>
                    ) : (
                        <>
                            <LeftSide context={context} />
                                <div className='centerContent'>
                                    <SendPost context={context} />
                                    <Feed context={context} />
                                </div>
                            <RightSide context={context} />
                        </>
                    )}
                </div>
            </div> 
        </>
    )
}

export default MainPage; 


