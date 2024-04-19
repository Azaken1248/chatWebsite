import React, { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";

const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);

  const handleLogin = (newUsername: string) => {
    setUsername(newUsername);
  };

  if (username !== null) {
    return <Chat username={username} />;
  }

  return <Login onLogin={handleLogin} />;
};

export default App;
