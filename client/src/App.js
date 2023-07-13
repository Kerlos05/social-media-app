import { BrowserRouter, Routes, Route, Outlet, Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./folders/login";
import Register from "./folders/register";
import MainPage from "./folders/Main/mainPage";

function App() {
  const [login, setLogin] = useState(true);
  const [username, setUsername] = useState(''); 

  return (
    <>
      {!login && (
        <BrowserRouter>
          <Routes>
            <Route path="/"  element={<Login setLogin={setLogin} username={username} setUsername={setUsername} />} />
            <Route path="/register" element={<Register setLogin={setLogin}/>} />
          </Routes>
        </BrowserRouter>
      )}
      {login && (
        <MainPage username = {username} setUsername={setUsername} />
      )}
    
    </>
  );
}
export default App;
