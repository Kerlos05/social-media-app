import { useEffect } from "react";
import '../../style/mainPage.css'; 
import { getFriends, getAllPosts, deleteUser } from '../../actions';
import { useContext } from "react";
import { AppContext } from "../../AppContext";
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
const socket = io('http://localhost:4500');

const DeleteUser = () => {
    const context = useContext(AppContext);
    const {
        username, 
        setLogin, 
        setAddedFriends, 
        setRecivedPost, 
        setUserContent,
        setUsername
    } = context; 
    const navigate = useNavigate(); 

    const handleDeleteUser = async(e) => {
        e.preventDefault();
        deleteUser(username, navigate, setLogin, setUsername); 

        socket.emit('updatePostUI', username);
        socket.emit('updateFriendUI', username);
    }

    useEffect(() => {
        socket.on('updateFriend', async(userToUpdate) => {
            await new Promise(r => setTimeout(r, 1600)); 
            getFriends(setAddedFriends, username); 
        })

        socket.on('updatePost', async() => {
            await new Promise(r => setTimeout(r, 1600)); 
            getAllPosts(setRecivedPost, setUserContent);
        })

        return () => {
            socket.off('updatePost'); 
            socket.off('updateFriend'); 
        }
    }, [socket]);

    return(
        <div className='p-3 mt-4 d-flex flex-column'>
            <p>
                This actions clearly communicates that the deleting of 
                <strong> your </strong> account is final and cannot be reversed
            </p>
            <button className='btn btn-danger' onClick={handleDeleteUser}>Delete</button>
        </div>
       
    ); 
}

export default DeleteUser; 