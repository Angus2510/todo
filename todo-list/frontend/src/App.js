import React, { useState } from 'react';
import Login from './components/Login';
import Navbars from './components/Navbars';
import Todo from './components/Todo';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userName, setUserName] = useState("");
  // const [token, setToken] = useState("");

  const handleLogin = (result) => {
    console.log(result);
    const user = {
      first_name: result.data.first_name,
      token: result.data.token
    }

    sessionStorage.setItem("user", JSON.stringify(user));
    // setUserName(data.first_name);
    // setToken(data.token);
    setIsLoggedIn(true);
  };

  return (
    <div>
      {!isLoggedIn && <Login onLogin={handleLogin} />}
      {isLoggedIn && (
        <div className="App">
          <Navbars />
          <Todo />
        </div>
      )}
    </div>
  );
}

export default App;
