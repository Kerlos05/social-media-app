import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
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
    const { setAddedFriends, username, setRecivedPost, setUserContent, setAvatar, showUserPage} = context;
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




/*

const handleToggleComment = (index) => {
        setCommentStates((prevStates) => {
            const newStates = [...prevStates];
            newStates[index] = !newStates[index];
            return newStates;
        });
    };

 const handleSub = (e, postId, index, lookingForUser) => {
        e.preventDefault();
        setCommentStates((prevStates) => {  
            const newStates = [...prevStates];
            newStates[index] = !newStates[index];
            return newStates;
        });

        const formData = new FormData(e.target);
        const enteredValue = formData.get(`recivedImage-${postId}`);
        console.log(enteredValue);

        fetch('http://localhost:8080/handle-post', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                index: index,
                comment: enteredValue,
                lookingForUser: lookingForUser,
                fromComment: true,
            })
        })
        .then((res) => {
            if(res.ok){
                getAllPosts(setRecivedPost, setUserContent); 
            }
        })
        
    };




*/
   


// <div>
// <div className='header'>
//     <Header username= {username} setUsername= {setUsername} setLogin={setLogin}/>
// </div>
// {userContent
// .filter(userContent => userContent.username  === showUserPage.username)
// .map((content, index) => {
//     return(
//     <div className='bg-light p-3 d-flex justify-content-between align-items-center' key={index}>
//         <div >
//         <div className='d-flex align-items-center '>
//             <i className='icon'> 
//                 <img width={200} src={content.avatar} />
//             </i>
//             <div className='ms-4 d-flex flex-column'>
//                 <p style={{margin: '0', padding: '0'}}>
//                     {showUserPage.username}
//                 </p>
//             </div>
//         </div>  
//         </div>

//         <div className='w-100 d-flex justify-content-center'>
//             <div className='mt-3 '>
//                 <h3>{content.title}</h3>
//                 <div className='mt-3'>
//                     <img src={content.post} />
//                 </div>
//                 <FontAwesomeIcon
//                     icon={faComment}
//                     style={{ cursor: 'pointer' }}
//                     onClick={() => handleToggleComment(index)}
//                 />
//                 {commentStates[index] && (
//                     <div>
//                         <form onSubmit={(e) => handleSub(e, content.id, index, content.username)} className='d-flex mt-4 mb-2'>
//                             <input name={`recivedImage-${content.id}`} className='form-control'/>
//                             <button type="submit"  className='btn btn-primary'>Comment</button>
//                         </form>
//                             {content.comments
//                             .filter((comment) => comment !== '')
//                             .map((comment, index) => {
//                                 return <p className='text-bg-dark p-3 rounded-pill' key={index}>{comment}</p>
//                             })}
//                     </div>
//                 )}
//             </div>
//         </div>
//     </div>
//     )
// })}
// </div>