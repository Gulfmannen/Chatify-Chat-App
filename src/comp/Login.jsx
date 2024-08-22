import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../ContextProvider/ContextProvider";

const Login = () => {
  const { loginUser } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState({ success: "", errors: null });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginUser(formData.username, formData.password);

    if (result.success) {
      setMessage({ success: "Login successful. Redirecting...", errors: null });
      setTimeout(() => navigate("/chat"), 3000);
    } else {
      setMessage({ success: "", errors: result.errors });
    }
  };

  return (
    <div>
      <div>
        <h1>Welcome to Galactic Chat</h1>
      </div>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <br />
        <button type="submit">Login</button>
        {message.success && (
          <div style={{ color: "green", marginTop: "20px" }}>
            {message.success}
          </div>
        )}
        {message.errors && (
          <div style={{ color: "red", marginTop: "20px" }}>
            <h4>Errors:</h4>
            {message.errors.message && <p>{message.errors.message}</p>}
            {message.errors.errors && (
              <ul>
                {Object.values(message.errors.errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        <button type="button" onClick={() => navigate("/")}>
          Back to Register
        </button>
      </form>
    </div>
  );
};

export default Login;
