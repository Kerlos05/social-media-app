import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppProvider, AppContext } from "./AppContext";
import Login from "./folders/login";
import Chat from "./folders/Main/chat";
import Register from "./folders/register";
import MainPage from "./folders/Main/mainPage";
import UserPage from "./folders/Main/userPage" ;
import DeleteUser from "./folders/Main/deleteUser";
import Settings from "./folders/Main/settings";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginWrapper />} />
          <Route path="/chat" element={<ChatWrapper />} />
          <Route path="/main" element={<MainPageWrapper />} />
          <Route path="/register" element={<RegisterWrapper />} />
          <Route path="/user-page" element={<UserPageWrapper />} />
          <Route path="/deleteUser" element={<DeleteUserWrapper />}/>
          <Route path="/settings" element={<SettingsWrapper />}/>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

function LoginWrapper() {
  const { login } = useContext(AppContext);
  return !login ? <Login /> : <Navigate to="/main" />;
}

function RegisterWrapper() {
  const { login } = useContext(AppContext);
  return !login ? <Register /> : <Navigate to="/main" />;
}

function MainPageWrapper() {
  const { login } = useContext(AppContext);
  return login ? <MainPage /> : <Navigate to="/" />;
}


function DeleteUserWrapper() {
  const { login } = useContext(AppContext);
  return login ? <DeleteUser /> : <Navigate to="/" />;
}

function SettingsWrapper() {
  const { login } = useContext(AppContext);
  return login ? <Settings /> : <Navigate to="/" />;
}


function UserPageWrapper() {
  const { login } = useContext(AppContext);
  return login ? <UserPage /> : <Navigate to="/" />;
}

function ChatWrapper() {
  const { login } = useContext(AppContext);
  return login ? <Chat /> : <Navigate to="/" />;
}


export default App;
