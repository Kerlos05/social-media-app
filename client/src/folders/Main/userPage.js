import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from "react";
import Header from './header';
import '../../style/mainPage.css'; 
import { useContext } from "react";
import { AppContext } from "../../AppContext";
import addUser from '../../image/add-user.png'; 
import deleteUser from '../../image/delete-user.png'; 
import { getFriends, handleDeletefriend, handleFriend, getAllPosts, handleDeletePost } from '../../actions';
import LeftSide from './leftSide';
import io from 'socket.io-client'
const socket = io('http://localhost:4500');


const UserPage = () => {
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
        setShowUserPage, 
    } = context; 

    const handleToggleComment = (index) => {
        setCommentStates((prevStates) => {
            const newStates = [...prevStates];
            newStates[index] = !newStates[index];
            return newStates;
        });
    };


    const handleSub = (e, postId, index, lookingForUser) => {
        e.preventDefault();
        // setCommentStates((prevStates) => {
        //     const newStates = [...prevStates];
        //     newStates[index] = !newStates[index];
        //     return newStates;
        // });

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
                socket.emit('updatePostUI')
                e.target.reset(); 
            }
        })
    };


    const deletePost = async (index) => {
        await handleDeletePost(username, index, setRecivedPost, setUserContent); 
        socket.emit('updatePostUI'); 
    }

    useEffect(() => {
        socket.on('updatePost', async(userToUpdate) => {
            console.log('received');
            await new Promise(r => setTimeout(r, 900)); 
            getAllPosts(setRecivedPost, setUserContent);

        })

        return () => {
            socket.off('updatePost'); 
        }
    }, [socket]);



    return(
       <> 
        <div className='p-2 container-fluid userPost'>
            <div className='header'>
            <Header context={context}/>
            </div>
            <div className='d-flex mt-5 '>
                <div className='container'>
                {username === showUserPage ? (
                    userContent
                        .filter(content => content.username === showUserPage)
                        .map((content, index) => {
                            return (
                                <div className='p-4 mb-4 me-2 ms-2 bg-light' key={index} >
                                    <div className='d-flex justify-content-between'>
                                        <div className='d-flex align-items-center'>
                                            <i className='icon'> 
                                                <img width={200} src={content.avatar} />
                                            </i>
                                            <div className='ms-4 d-flex flex-column'>
                                                <p style={{margin: '0',padding: '0',fontSize: '32px'}}>
                                                    {showUserPage}
                                                </p>
                                            </div>
                                        </div> 
                                        <button className='btn btn-danger' style={{height: 'fit-content'}} onClick={() => deletePost(index)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                        <div className='mt-4 '>
                                            <h3>{content.title}</h3>
                                            {content.post.length > 0 
                                                ?   <div className='mt-3'>
                                                        <img src={content.post} className='mb-4' style={{width: '100%', height: '600px'}} />
                                                    </div>
                                                : '' 
                                            }

                                            <div className='d-flex align-items-center gap-2'>
                                                <FontAwesomeIcon
                                                    icon={faComment}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleToggleComment(index)}
                                                />
                                                <p style={{fontSize: '18px', margin: '0', padding: '0'}}>{content.comments.filter((comment) => comment !== '').length}</p>
    
                                            </div>
                                            
                                            {commentStates[index] && (
                                                <div className='mb-5 mt-3 '>
                                                    <form onSubmit={(e) => handleSub(e, content.id, index, content.username)} className='d-flex '>
                                                        <input name={`recivedImage-${content.id}`} className='form-control'/>
                                                        <button type="submit"  className='btn btn-primary'>Comment</button>
                                                    </form>
    
                                                    <div className='mt-4'>
                                                        {content.comments.filter((comment) => comment !== '').map((comment, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    <p className='p-2 rounded-pill' key={index}>{comment}</p>
                                                                    <hr />
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            )
                    ) : (
                    userContent
                        .filter(content => content.username === showUserPage)
                        .map((content, index) => {
                            return (
                                <div className='p-4 mb-4 me-2 ms-2 bg-light' key={index} >
                                    <div className='d-flex '>
                                        <div className='d-flex align-items-center'>
                                            <i className='icon'> 
                                                <img width={200} src={content.avatar} />
                                            </i>
                                            <div className='ms-4 d-flex flex-column'>
                                                <p style={{margin: '0',padding: '0',fontSize: '32px'}}>
                                                    {showUserPage}
                                                </p>
                                            </div>
                                        </div> 
                                    </div>
                                    <div>
                                        <div className='mt-4 '>
                                            <h3>{content.title}</h3>
                                            <div className='mt-3 mb-3'>
                                            <img src={content.post} className='mb-4' style={{width: '100%', height: '600px'}} />
                                            </div>
                                            <div className='d-flex align-items-center gap-2'>
                                                <FontAwesomeIcon
                                                    icon={faComment}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleToggleComment(index)}
                                                />
                                                <p style={{fontSize: '18px', margin: '0', padding: '0'}}>{content.comments.filter((comment) => comment !== '').length}</p>

                                            </div>
                                            
                                            {commentStates[index] && (
                                                <div className='mb-5 mt-3 '>
                                                    <form onSubmit={(e) => handleSub(e, content.id, index, content.username)} className='d-flex '>
                                                        <input name={`recivedImage-${content.id}`} className='form-control'/>
                                                        <button type="submit"  className='btn btn-primary'>Comment</button>
                                                    </form>

                                                    <div className='mt-4'>
                                                        {content.comments.filter((comment) => comment !== '').map((comment, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    <p className='p-2 rounded-pill' key={index}>{comment}</p>
                                                                    <hr />
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        ))}
                        
                </div>
            </div>    
        </div>
       </>
    )
}


export default UserPage; 



// {userContent
//     .filter(userContent => userContent.username  === showUserPage)
//     .map((content, index) => {
//         return(
//         <div className='bg-light p-4 mb-4 me-2 ms-2 'key={index}>
//             <div className='d-flex justify-content-between'>
//                 <div className='d-flex align-items-center'>
//                     <i className='icon'> 
//                         <img width={200} src={content.avatar} />
//                     </i>
//                     <div className='ms-4 d-flex flex-column'>
//                         <p style={{margin: '0',padding: '0',fontSize: '32px'}}>
//                             {showUserPage}
//                         </p>
//                     </div>
//                 </div> 
//             </div>

//             <div className=''>
//                 <div className='mt-3 '>
//                     <h3>{content.title}</h3>
//                     <div className='mt-3 mb-3'>
//                         <img src={content.post} />
//                     </div>
//                     <div className='d-flex align-items-center gap-2'>
//                         <FontAwesomeIcon
//                             icon={faComment}
//                             style={{ cursor: 'pointer' }}
//                             onClick={() => handleToggleComment(index)}
//                         />
//                         <p style={{fontSize: '18px', margin: '0', padding: '0'}}>{content.comments.filter((comment) => comment !== '').length}</p>

//                     </div>
           

//                     {commentStates[index] && (
//                         <div className='mb-5 mt-3 '>
//                             <form onSubmit={(e) => handleSub(e, content.id, index, content.username)} className='d-flex '>
//                                 <input name={`recivedImage-${content.id}`} className='form-control'/>
//                                 <button type="submit"  className='btn btn-primary'>Comment</button>
//                             </form>

//                             {/* We could add who send it and when ??? */}
//                             <div className='mt-4'>
//                                 {content.comments.filter((comment) => comment !== '').map((comment, index) => {
//                                 return (
//                                     <div key={index}>
//                                         <p className='p-2 rounded-pill' key={index}>{comment}</p>
//                                         <hr />
//                                     </div>
//                                 )
//                                 })}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// })}



/*

*/