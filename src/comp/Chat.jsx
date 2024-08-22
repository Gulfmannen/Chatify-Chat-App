import { useContext, useState, useEffect, useRef } from "react";
import { Context } from "../ContextProvider/ContextProvider";
import "../styles/Chat.css";

const Chat = () => {
  const { username, decodedToken } = useContext(Context);
  const [avatar, setAvatar] = useState("default-avatar-url.png");
  const [messageText, setMessageText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (decodedToken?.avatar) {
      setAvatar(decodedToken.avatar);
    }
  }, [decodedToken]);

  const sendMessage = () => {
    if (!messageText.trim()) return;

    setChatHistory((prevMessages) => [
      ...prevMessages,
      { text: messageText, sender: username, avatar },
    ]);
    setMessageText("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>Welcome, {username} to Galatic Chat</h2>
      </header>

      <div className="messages-container">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.sender === username ? "sent" : "received"
            }`}
          >
            {message.sender !== username && (
              <img
                src={message.avatar}
                alt={`${message.sender}'s avatar`}
                className="avatar"
              />
            )}
            <div className="bubble">
              <strong>{message.sender}</strong>
              <p>{message.text}</p>
            </div>
            {message.sender === username && (
              <img
                src={message.avatar}
                alt={`${message.sender}'s avatar`}
                className="avatar"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message here..."
          className="input"
        />
        <button onClick={sendMessage} className="send-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
