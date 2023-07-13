import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faArrowRight, faArrowLeft, faGear, faImage, faLink, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import Header from './header'; 


const SendPost = ({username}) => {
    const [avatar, setAvatar] = useState([]);
    const [image, setImage] = useState(''); 
    const [messagePost, setMessagePost] = useState('');

    const getImage = async () => {
        await fetch("http://localhost:8080/get-image", {
            method: "POST", 
            headers: {'Content-Type': 'application/json'}, 
            crossDomain: true, 
            body:JSON.stringify({
                username: username
            }), 
        })
        .then((res) => res.json()).then((data) =>{
            return setAvatar([data.data]); 
        })
    }
    
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

    useEffect(() => {
        getImage(); 
    }, [])

    const handleSub = async(e) => {
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
                image: image , 
                title: messagePost,
                avatar: userAvatar
            })
        })
        .then(res => {
            if(res.ok){
                setImage(''); 
                setMessagePost(''); 
            }
        })
    }

    return(
        <>  
        {avatar.length > 0 ? (
            avatar.map((data, index) => {
                return(
                    <div className='bg-light p-3 me-4 d-flex justify-content-between align-items-center' key={index}>
                        <div className='container '> 
                            <div className='inputSection gap-4 '>
                                <form onSubmit={handleSub}>
                                  <div className='d-flex align-items-center gap-5'>
                                    <i className='icon'> 
                                        <img key={index} width={200} src={data} />
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
                                            <p style={{margin: '0',padding: '0'}}><FontAwesomeIcon icon={faImage}></FontAwesomeIcon>Image</p>
                                        </label>
                                        <button type='submit' className='btn btn-primary'>POST</button>
                                    </div>
                                  </div>
                                </form>
                                {image !== '' ?  
                                    <div className='d-flex align-items-center justify-content-between mb-3 mt-3' key={index}>
                                        <div style={{outline: 'dashed 2px blue'}} className='p-3'>
                                            <img width={200} src={image} key={index}  />
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