import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faArrowRight, faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";

const LeftSide = ({username}) => {
    const [avatar, setAvatar] = useState([]);
    const [friendList, setFriendList] = useState([]); 

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

    return(
        <>  
                    
            {avatar.length > 0 ? (

                avatar.map((data, index) => {
                    return(
                        <div className='bg-light p-3 me-4 d-flex justify-content-between align-items-center' key={index}>
                            <div className='d-flex align-items-center '>
                                <i className='icon'> 
                                    <img key={index} width={200} src={data} />
                                </i>
                                <div className='ms-4 d-flex flex-column'>
                                    <p style={{'margin': '0', 'padding': '0'}}>{username}</p>
                                    {/* How many friends he have */}
                                    <p style={{'margin': '0', 'padding': '0'}}>0 friends</p>
                                </div>
                            </div>
                            <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>
                            {/* In the future the user could add their socail media ?? */}
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