import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [addedFriends, setAddedFriends] = useState([]);
  const [recivedPost, setRecivedPost] = useState([]);
  const [commentStates, setCommentStates] = useState([]);
  const [avatar, setAvatar] = useState([]);
  const [showUserPage, setShowUserPage] = useState([]);
  const [userContent, setUserContent] = useState([]);

  return (
    <AppContext.Provider
      value={{
        login,
        setLogin,
        username,
        setUsername,
        addedFriends,
        setAddedFriends,
        recivedPost,
        setRecivedPost,
        commentStates,
        setCommentStates,
        avatar,
        setAvatar,
        showUserPage,
        setShowUserPage,
        userContent,
        setUserContent
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
