import { useEffect } from "react";
import { getFriends, handleDeletefriend} from '../../actions';
import deleteUser from '../../image/delete-user.png'; 
import '../../style/mainPage.css'
import io from 'socket.io-client'
const socket = io('http://localhost:4500');

const RightSide = ({ context }) => {
    const { username, addedFriends, setAddedFriends } = context;

    
    useEffect(() => {
        socket.on('updateFriend', async(userToUpdate) => {
            await new Promise(r => setTimeout(r, 1000)); 
            getFriends(setAddedFriends, username); 
        })

        return () => {
            socket.off('updateFriend'); 
        }
    }, [socket]);

    return(
        <>  
        <div className='d-grid p-3 rightSide bg-light'>
           <div className="mt-3">
            <h4>FriendsList</h4>
                <div>
                {addedFriends.length > 0 ? (
                  addedFriends[0] === undefined ? '' : 
                  addedFriends[0].map((friend, index) => (
                    <div key={index} className='d-flex justify-content-between align-items-center mt-4'>
                    <p style={{margin: '0', padding: '0'}}>{friend}</p>
                    <button className='btn ms-2' 
                        onClick={ () => {
                            handleDeletefriend(friend, setAddedFriends, username)
                            socket.emit('updateFriendUI', friend); 
                            }}>
                        <img src={ deleteUser } alt='avatar' />
                    </button>    
                </div>
                ))
                ) : (
                    ''
                )}
                </div>
           </div>
        </div>
        </>
    )

}

export default RightSide; 
