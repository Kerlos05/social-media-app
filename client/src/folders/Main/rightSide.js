import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faArrowRight, faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";

const RightSide = ({username}) => {
    const [avatar, setAvatar] = useState([]);
    const [friendList, setFriendList] = useState([]); 

    const getImage = async () => {

        await fetch("http://localhost:8080/get-image", {
            method: "POST", 
            headers: {'Content-Type': 'application/json'}, 
            crossDomain: true, 
            body:JSON.stringify({username: username}), 
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
            <div className='d-grid bg-light p-3'>
                <h4>FriendsList</h4>
                // We should call the get-image function for all friends and then we shall display them

                {/* displaying friends */}
            </div>
        
        </>
    )

}

export default RightSide; 