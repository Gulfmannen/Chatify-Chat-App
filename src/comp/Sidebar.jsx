import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../ContextProvider/ContextProvider";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { handleLogout, username, decodedToken } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [avatar, setAvatar] = useState("default-avatar-url.png");

  useEffect(() => {
    if (decodedToken?.avatar) {
      setAvatar(decodedToken.avatar);
    }
  }, [decodedToken]);

  const logout = () => {
    handleLogout();
    navigate("/login");
  };

  const isOnChatPage = location.pathname === "/chat";
  const isOnProfilePage = location.pathname === "/profile";

  return (
    <aside className="sidebar">
      <div className="user-section">
        <img src={avatar} alt="User Avatar" className="avatar" />
        <p>Welcome, {username}!</p>
      </div>
      <nav>
        <ul>
          {isOnChatPage && (
            <li>
              <Link to="/profile">Go to Profile</Link>
            </li>
          )}
          {isOnProfilePage && (
            <li>
              <Link to="/chat">Go to Chat</Link>
            </li>
          )}
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
