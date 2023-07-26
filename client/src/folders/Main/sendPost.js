import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faArrowRight, faArrowLeft, faGear, faImage, faLink, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { getAllPosts } from '../../actions';
import { throttle } from 'lodash'; 
import io from 'socket.io-client'
const socket = io('http://localhost:4500');

const SendPost = ({context}) => {
    const [image, setImage] = useState(''); 
    const [messagePost, setMessagePost] = useState('');
    const {username, avatar, setRecivedPost, setUserContent} =  context; 
    
    const toBase64 = (e) => {
        e.preventDefault();
        var reader = new FileReader; 
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setImage(reader.result); 
        } 
        reader.onerror = (err) => {
        console.log(err);
        }
    }


    const handleSub = throttle(
        async(e) => {
            e.preventDefault(); 
            const userAvatar = avatar.map((item) => {return item}); 
            fetch('http://localhost:8080/handle-post', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json', 
                    Accept: 'application/json', 
                    'Access-Control-Allow-Origin': '*', 
                },
                body: JSON.stringify({
                    username: username, 
                    post: image , 
                    title: messagePost,
                    avatar: userAvatar
                })
            })
            .then(res => {
                if(res.ok){
                    getAllPosts(setRecivedPost, setUserContent); 
                    setImage(''); 
                    setMessagePost(''); 
                    socket.emit('updatePostUI')
                }
            })
        },1000
    )

    return(
        <>  
        {avatar.length > 0 ? (
            avatar.map((data, index) => {
                return(
                    <div className='p-3 sendPost bg-light' key={index} >
                        <div className='container'> 
                            <div className='inputSection gap-4 '>
                                <form onSubmit={handleSub}>
                                  <div className='d-flex align-items-center gap-5'>
                                    <i className='icon'> 
                                        <img key={index} width={100} src={data} />
                                    </i>
                                    <input 
                                        type="text" 
                                        placeholder='What`s in your mind?'  
                                        className='form-control'
                                        onChange={e => setMessagePost(e.target.value)}
                                        value={messagePost}
                                    />
                                  </div>
                                  <hr />
                                  <div className='fileSection'>

                                    <div className='d-flex align-items-center justify-content-between'>
                                        <label htmlFor="image">
                                            <input
                                                accept="image/*"
                                                type="file"
                                                id="image"
                                                onChange={toBase64}
                                                style={{ display: 'none' }}
                                            />
                                            <p style={{margin: '0',padding: '0', cursor: 'pointer'}}><FontAwesomeIcon icon={faImage} className='me-2'></FontAwesomeIcon>Image</p>
                                        </label>
                                        <button type='submit' className='btn btn-primary'>POST</button>
                                    </div>
                                  </div>
                                </form>
                                {image !== '' ?  
                                    <div className='d-flex align-items-center justify-content-between mb-3 mt-3' key={index}>
                                        <div style={{outline: 'dashed 2px blue'}} className='p-3'>
                                            <img width={200} src={image}  />
                                        </div>
                                        <button 
                                            className='btn'
                                            onClick={() => { setImage(''); }}> 
                                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                        </button>
                                    </div>
                                    : ''
                                }                                
                            </div>
                        </div>
                    </div>
                )
            })
            ) : (
            <span className='spinner-border'></span>
        )}
        </>
    )

}

export default SendPost; 