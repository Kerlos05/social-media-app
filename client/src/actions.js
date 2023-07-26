import { throttle } from 'lodash'; 



export const getFriends = async(setAddedFriends, username) => {
  await fetch(`http://localhost:8080/handleFriend/${encodeURIComponent(username)}`, {
    method: 'GET',   
  })
  .then((res) => res.json())
  .then((data) => {
    setAddedFriends([data.friends]);
  })
}


export const handleDeletefriend = throttle(
  async (friendToDelete, setAddedFriends, username, setReceivedMessages) => {
    fetch('http://localhost:8080/handleFriend', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        friendToDelete: friendToDelete,
      }),
    })
    .then(async (res) => {
      await getFriends(setAddedFriends, username);
      
      if (setReceivedMessages) {
        setReceivedMessages([]); 
      }
    });
  },
  1000
);

export const handleFriend = throttle(
  async (friendToAdd, setAddedFriends, username) => {
    fetch('http://localhost:8080/handleFriend', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        friendToAdd: friendToAdd,
      }),
    }).then(() => {
      getFriends(setAddedFriends, username);
    });
  },
  1000
);


export const getAllPosts = async (setRecivedPost, setUserContent) => {
  await fetch('http://localhost:8080/handle-post', {
    method: 'GET',
  })
  .then(res => res.json())
  .then(data => {
    try{
      setRecivedPost(data.all); 
      setUserContent(data.all); 
    } catch(err) {
      console.log('');
    }
   
  })
}



export const getImage = async (username, setAvatar) => {
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



export const handleLogout = (username) =>{
  fetch('http://localhost:8080/auth', {
    method: 'PUT',
    headers:{
      'content-type': 'application/json'
    }, 
    body: JSON.stringify({
      username: username, 
    })
  })
}




export const deleteMessage = throttle(
  async (username, activeFriend, messageContent, setReceivedMessages, index) => {
    await fetch('http://localhost:8080/handleMessage', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        friend: activeFriend,
        messageToRemove: messageContent,
        index: index
      }),
    })
    .then(res  => {
      if(res.ok){
        getAllMessages(username, activeFriend, setReceivedMessages)
      }
    })
  },
  700 
);


export const sendNewMessage = throttle(
  (username, sendMessage, activeFriend, setReceivedMessages) => {
    fetch('http://localhost:8080/handleMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: sendMessage,
        username: username,
        selectedFriend: activeFriend,
      }),
    })
    .then(res  => {
      if(res.ok){
        getAllMessages(username, activeFriend, setReceivedMessages)
      }
    })
  },
  400
);





export const getAllMessages = async (username, activeFriend, setReceivedMessages) => {
  fetch(`http://localhost:8080/handleMessage`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username, 
      selectedFriend: activeFriend
    })
  })
  .then((res) => res.json())
  .then((data) => {
    if(data.length >= 0){
      setReceivedMessages(data || '');
    }
  })
 
}


export const handleDeletePost = async (username, index, setRecivedPost, setUserContent) => {
  try {
    const response = await fetch('http://localhost:8080/handle-post', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      }, 
      body: JSON.stringify({
        username: username, 
        index: index
      })
    });

    if (response.ok) {
      await getAllPosts(setRecivedPost, setUserContent); 
    } else {
      console.error('Deletion failed', response.status, response.statusText);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}



export const deleteUser = async(username, navigate, setLogin,  setUsername) => {  
  await fetch('http://localhost:8080/delete-user', {
    method: 'DELETE',
    headers:{
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      username: username
    })
  })
  .then((res) => {
    setLogin(false); 
    setUsername(''); 
    navigate('/'); 
    handleLogout(username); 
  })
}