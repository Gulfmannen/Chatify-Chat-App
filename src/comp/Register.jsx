import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../ContextProvider/ContextProvider";

const Register = () => {
  const navigate = useNavigate();
  const { avatarUrl, handlePreview, handleSelect, registerUser } =
    useContext(Context);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData.username, formData.password, formData.email);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div>
      <div>
        <h1>Welcome to Galactic Chat</h1>
      </div>
      <h2>Registrations</h2>
      <form onSubmit={handleSubmit}>
        {["username", "password", "email"].map((field, idx) => (
          <div key={idx}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
          </div>
        ))}

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h3>Select Avatar</h3>
          <button type="button" onClick={handlePreview}>
            Preview Avatar
          </button>
          {avatarUrl && (
            <div style={{ marginTop: "10px" }}>
              <img src={avatarUrl} alt="Avatar" />
              <button
                type="button"
                onClick={handleSelect}
                style={{ marginTop: "10px" }}
              >
                Select your Avatar
              </button>
            </div>
          )}
        </div>

        <button type="submit" style={{ marginTop: "20px" }}>
          Register
        </button>
      </form>

      <div style={{ marginTop: "20px" }}>
        <h5>
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/login")}>
            Sign in
          </button>
        </h5>
      </div>
    </div>
  );
};

export default Register;
