import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faArrowRight, faArrowLeft, faGear, faComment } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import addUser from '../../image/add-user.png'; 
import deleteUser from '../../image/delete-user.png'; 


const Feed = ({username}) => {
    const [recivedPost, setRecivedPost] = useState([]); 
    const [recivedAvatars, setRecivedAvatars] = useState([]);
    const [commentStates, setCommentStates] = useState([]);
    const [addedFriends, setAddedFriends] = useState([]);
    
    const handleSub = (e, postId) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const enteredValue = formData.get(`recivedImage-${postId}`);
        console.log(enteredValue);
    };

  

    const handleToggleComment = (index) => {
        setCommentStates((prevStates) => {
        const newStates = [...prevStates];
        newStates[index] = !newStates[index];
        return newStates;
        });
    };

   
    const getAllPosts = async () => {
        await fetch('http://localhost:8080/handle-post', {
             method: 'GET',
         })
         .then(res => res.json())
         .then(data => {
             setRecivedPost(data.all); 
         })
    }
 

    const handleFriend = async (friendToAdd) => {
        fetch('http://localhost:8080/handleFriend', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username: username, 
                friendToAdd: friendToAdd
            })
        })
        .then(() => {
            getFriends(); 
        })
      
    }

    const getFriends = async() => {
        fetch(`http://localhost:8080/handleFriend/${encodeURIComponent(username)}`, {
            method: 'GET',   
        })
        .then((res) => res.json())
        .then((data) => {
            setAddedFriends([data]);
        })
    }


    const handleDeletefriend = async(friendToAdd) => {
        fetch('http://localhost:8080/handleFriend', {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username: username, 
                friendToAdd: friendToAdd
            })
        })
        .then(() => {
            getFriends(); 
        })
      
    }

    
    useEffect(() => {
        getAllPosts(); 
        getFriends(); 
    }, [])


    return (
        <>
        <div className='d-grid w-100 '>
         {recivedPost.map((item, index) => {
             return(
                <div key={index}>
                    <div className='bg-light p-3 me-4 d-flex justify-content-between align-items-center' key={index}>
                        <div className='d-flex align-items-center '>
                            <i className='icon'> 
                                <img key={index} width={200} src={item.avatar} />
                            </i>
                            <div className='ms-4 d-flex flex-column'>
                                <p style={{'margin': '0', 'padding': '0'}}>{item.username}</p>
                            </div>
                        </div>
                        <div>

                          {item.username !== username && (
                            <button className='btn ms-2' 
                            onClick={(addedFriends[0].friends.includes(item.username)) ? () => handleDeletefriend(item.username) : () =>  handleFriend(item.username)}>
                                <img src={`${(addedFriends[0].friends.includes(item.username)) ? deleteUser : addUser}`} alt='avatar' />
                            </button>
                          )}
                        </div>
                    </div>

                    {/* Comment and title */}
                  
                  
                </div>
            )
            })}
        </div>
        </>
    );

}

export default Feed; 

{/* <form onSubmit={(e) => handleSub(e, post.id)}> */}
{/* <input name={`recivedImage-${post.id}`}/> */}
{/* <button type="submit">Send</button> */}
// </form>



// {recivedImage.map((image, index) =>{
//     return <img src={image} key={index}/>
// })}

// <br />
// <br />
// {recived.map((text, index) =>{
//     return <p  key={index}>{text}</p>
// })}
// <br />
// <br />
// {recivedUsername.map((text, index) =>{
//     return <p  key={index}>{text}</p>
// })}





// <div className='w-100 d-flex justify-content-center'>
//                   {item.title !== '' ? (
//                         <div className='mt-3 '>
//                             <h3>{item.title}</h3>
//                             <div className='mt-3'>
//                                 <img src={item.image} />
//                             </div>
//                             <FontAwesomeIcon
//                                 icon={faComment}
//                                 style={{ cursor: 'pointer' }}
//                                 onClick={() => handleToggleComment(index)}
//                             />
//                             {commentStates[index] && (
//                                 <div>
                                    
//                                 <form onSubmit={(e) => handleSub(e, item.id)}>
//                                     <input name={`recivedImage-${item.id}`}/>
//                                     <button type="submit">Send</button>
//                                 </form>
//                                     <p className='text-bg-dark p-3 rounded-pill'>{item.title}</p>
//                                     {/* We shall replace this with our comment not the title  */}
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <>
//                          <FontAwesomeIcon
//                                 icon={faComment}
//                                 style={{ cursor: 'pointer' }}
//                                 onClick={() => handleToggleComment(index)}
//                             />
//                             {commentStates[index] && (
//                                 <div>
                                    
//                                 <form onSubmit={(e) => handleSub(e, item.id)}>
//                                     <input name={`recivedImage-${item.id}`}/>
//                                     <button type="submit">Send</button>
//                                 </form>
//                                     <p className='text-bg-dark p-3 rounded-pill'>{item.title}</p>
//                                     {/* We shall replace this with our comment not the title  */}
//                                 </div>
//                             )}
//                         </>
//                     )}
//                   </div>