import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faArrowRight, faArrowLeft, faGear, faComment } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import addUser from '../../image/add-user.png'; 
import deleteUser from '../../image/delete-user.png'; 
import { getFriends, handleDeletefriend, handleFriend, getAllPosts} from '../../actions';
import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
const socket = io('http://localhost:4500');

const Feed = ({context}) => {
    const [recivedAvatars, setRecivedAvatars] = useState([]);
    const [commentStates, setCommentStates] = useState([]);

    const {
        username, 
        addedFriends, 
        setAddedFriends, 
        recivedPost,
        setRecivedPost, 
        setShowUserPage, 
        setUserContent
    } = context
    const navigate = useNavigate();

    const handleSub = (e, postId, index) => {
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
                comment: enteredValue
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

    const handleToggleComment = (index) => {
        setCommentStates((prevStates) => {
            const newStates = [...prevStates];
            newStates[index] = !newStates[index];
            return newStates;
        });
    };

    const userPage = (openPageForUsername) => {
        setShowUserPage(openPageForUsername);
        getAllPosts(setRecivedPost, setUserContent); 
        navigate('/user-page'); 
    }


    useEffect(() => {
        socket.on('updateFriend', async(userToUpdate) => {
            if(userToUpdate !== username){
                return ; 
            }
            await new Promise(r => setTimeout(r, 1000)); 
            getFriends(setAddedFriends, userToUpdate); 
        })

        socket.on('updatePost', async(userToUpdate) => {
            await new Promise(r => setTimeout(r, 1000)); 
            getAllPosts(setRecivedPost, setUserContent); 
        })

        return () => {
            socket.off('updateFriend'); 
            socket.off('updatePost'); 
        }
    }, [socket]);
    
    return (
        <>
            {recivedPost.map((item, index) => {
                return(
                    <div key={index} className='mt-4 p-3 bg-light feed'>
                        <div className='d-flex justify-content-between align-items-center mb-4'>
                            <div className='d-flex align-items-center'>
                                <i className='icon'> 
                                    <img width={200} src={item.avatar} />
                                </i>
                                <div className='ms-4 d-flex flex-column'>
                                    <p className=' toUserPage' onClick={() => userPage(item.username )}>
                                        {item.username}
                                    </p>
                                </div>
                            </div>
                            <div>
                                {addedFriends[0] && addedFriends[0].includes(item.username) && (
                                <button
                                    className='btn ms-2'
                                    onClick={() =>{
                                        handleDeletefriend(item.username, setAddedFriends, username);
                                        socket.emit('updateFriendUI', item.username); 
                                    }}
                                >
                                    <img src={deleteUser} alt='avatar' />
                                </button>
                                )}

                                {!addedFriends[0] || (!addedFriends[0].includes(item.username) && item.username !== username) && (
                                <button
                                    className='btn ms-2'
                                    onClick={() => {
                                        handleFriend(item.username, setAddedFriends, username);
                                        socket.emit('updateFriendUI', item.username);
                                    }}
                                >
                                    <img src={addUser} alt='avatar' />
                                </button>
                                )}
                            </div>
                        </div>
                        <div className='w-100'>
                            <div className='mt-3'>
                                <h3>{item.title}</h3>
                                {item.post.length > 0 
                                    ?   <div className='mt-3 imageContianer w-100'>
                                            <img src={item.post} className='mb-4' style={{width: '100%', height: '600px'}} />
                                        </div>
                                    : '' 
                                }
                              

                                <div className='d-flex align-items-center gap-2'>
                                    <FontAwesomeIcon
                                        icon={faComment}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleToggleComment(index)}
                                    />
                                    <p style={{fontSize: '18px', margin: '0', padding: '0'}}>{item.comments.filter((comment) => comment !== '').length}</p>

                                </div>
                                
                                {commentStates[index] && (
                                    <div className='mb-5 mt-3'>
                                        <form onSubmit={(e) => handleSub(e, item.id, index)} className='d-flex '>
                                            <input name={`recivedImage-${item.id}`} className='form-control'/>
                                            <button type="submit"  className='btn btn-primary'>Comment</button>
                                        </form>

                                        {/* We could add who send it and when ??? */}
                                        <div className='mt-4'>
                                            {item.comments.filter((comment) => comment !== '').map((comment, index) => {
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
                )
            })}
        </>
    );

}

export default Feed; 

{/* <form onSubmit={(e) => handleSub(e, post.id)}> */}
{/* <input name={`recivedImage-${post.id}`}/> */}
{/* <button type="submit">Send</button> */}
//  </form>



//  {recivedImage.map((image, index) =>{
//      return <img src={image} key={index}/>
//  })}

//  <br />
//  <br />
//  {recived.map((text, index) =>{
//      return <p  key={index}>{text}</p>
//  })}
//  <br />
//  <br />
//  {recivedUsername.map((text, index) =>{
//      return <p  key={index}>{text}</p>
//  })}





//  <div className='w-100 d-flex justify-content-center'>
//                    {item.title !== '' ? (
//                          <div className='mt-3 '>
//                              <h3>{item.title}</h3>
//                              <div className='mt-3'>
//                                  <img src={item.image} />
//                              </div>
//                              <FontAwesomeIcon
//                                  icon={faComment}
//                                  style={{ cursor: 'pointer' }}
//                                  onClick={() => handleToggleComment(index)}
//                              />
//                              {commentStates[index] && (
//                                  <div>
                                    
//                                  <form onSubmit={(e) => handleSub(e, item.id)}>
//                                      <input name={`recivedImage-${item.id}`}/>
//                                      <button type="submit">Send</button>
//                                  </form>
//                                      <p className='text-bg-dark p-3 rounded-pill'>{item.title}</p>
//                                      {/* We shall replace this with our comment not the title  */}
//                                  </div>
//                              )}
//                          </div>
//                      ) : (
//                          <>
//                           <FontAwesomeIcon
//                                  icon={faComment}
//                                  style={{ cursor: 'pointer' }}
//                                  onClick={() => handleToggleComment(index)}
//                              />
//                              {commentStates[index] && (
//                                  <div>
                                    
//                                  <form onSubmit={(e) => handleSub(e, item.id)}>
//                                      <input name={`recivedImage-${item.id}`}/>
//                                      <button type="submit">Send</button>
//                                  </form>
//                                      <p className='text-bg-dark p-3 rounded-pill'>{item.title}</p>
//                                      {/* We shall replace this with our comment not the title  */}
//                                  </div>
//                              )}
//                          </>
//                      )}
//                    </div>