import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faArrowRight, faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { getFriends } from '../../actions';
import { useNavigate } from 'react-router-dom';

const LeftSide = ({context}) => {
    const [avatar, setAvatar] = useState([]);
    const {username, addedFriends} = context
    const navigate = useNavigate(); 

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
            setAvatar([data.data]); 
        })
    }

    useEffect(() => {
        getImage(); 
    }, [])

    const handleSettings = () => {
        navigate('/settings'); 
    }
    

    return(
        <>  
            {avatar.length > 0 ? (
                avatar.map((data, index) => {
                    return(
                        <div className=' p-3 me-4 d-flex align-items-center bg-light leftSide' key={index}>
                            <div className='d-flex align-items-center w-100 p-1 '>
                                <i className='icon'> 
                                    <img key={index} width={200} src={data} />
                                </i>
                                <div className='ms-3 d-flex flex-column w-100'>
                                    <div className='d-flex align-items-center justify-content-between w-100'>
                                        <p style={{'margin': '0'}}>{username}</p>
                                        <button type="button" className="btn " onClick={handleSettings}>
                                            <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>
                                        </button>
                                    </div>
                                    <p style={{'margin': '0', 'padding': '0'}} className='w-100'>
                                        {addedFriends[0] === undefined
                                            ? '0 friends' : addedFriends[0].length > 0
                                            
                                            ? addedFriends[0].length + ' friends'
                                            : '0 friends'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div>
                            
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

export default LeftSide; 