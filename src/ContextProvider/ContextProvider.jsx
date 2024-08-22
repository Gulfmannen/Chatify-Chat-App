import { createContext, useEffect, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);
  const [email, setEmail] = useState("");

  // Fetch CSRF Token
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(
          "https://chatify-api.up.railway.app/csrf",
          { method: "PATCH" }
        );
        if (!response.ok)
          throw new Error(
            `Failed to fetch CSRF token: ${await response.text()}`
          );
        const { csrfToken } = await response.json();
        setCsrfToken(csrfToken);
        localStorage.setItem("csrfToken", csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, []);

  // Handle Avatar Preview and Selection
  const handlePreview = () => {
    const newAvatarUrl = `https://i.pravatar.cc/150?img=${Math.floor(
      Math.random() * 70
    )}`;
    setAvatarUrl(newAvatarUrl);
    console.log("Avatar preview URL:", newAvatarUrl);
  };

  const handleSelect = () => {
    setSelectedAvatar(avatarUrl);
    console.log("Avatar selected:", avatarUrl);
    alert("Avatar selected!");
  };

  // JWT Decoding
  const decodeJwt = (token) => {
    try {
      const [, payload] = token.split(".");
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  };

  // Authentication
  const authenticateUser = async (url, body) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok)
        throw new Error(`Request failed: ${await response.json()}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(
        `${url.includes("/token") ? "Login" : "Registration"} failed:`,
        error
      );
      return { success: false, errors: { message: error.message } };
    }
  };

  const registerUser = (username, password, email) =>
    authenticateUser("https://chatify-api.up.railway.app/auth/register", {
      username,
      password,
      email,
      avatar: selectedAvatar,
      csrfToken,
    });

  const loginUser = async (username, password) => {
    const { success, data } = await authenticateUser(
      "https://chatify-api.up.railway.app/auth/token",
      {
        username,
        password,
        csrfToken,
      }
    );
    if (success) {
      const { token } = data;
      sessionStorage.setItem("jwtToken", token);
      setDecodedToken(decodeJwt(token));
      setIsAuthenticated(true);
      setUsername(username);
    }
    return { success, data };
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("jwtToken");
    setIsAuthenticated(false);
    setUsername("");
    setSelectedAvatar("");
    setDecodedToken(null);
    fetchCsrfToken();
  };

  // Profile Management
  const updateProfile = async (newUsername, newEmail, newAvatar, userId) => {
    try {
      const response = await fetch("https://chatify-api.up.railway.app/user", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          updatedData: {
            username: newUsername,
            email: newEmail,
            avatar: newAvatar,
          },
        }),
      });
      if (!response.ok)
        throw new Error(`Failed to update profile: ${await response.json()}`);
      setUsername(newUsername);
      setEmail(newEmail);
      setSelectedAvatar(newAvatar);
      return { success: true, data: await response.json() };
    } catch (error) {
      console.error("Update profile failed:", error);
      return { success: false, errors: { message: error.message } };
    }
  };

  const deleteProfile = async (userId) => {
    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
        }
      );
      if (!response.ok)
        throw new Error(`Failed to delete profile: ${await response.json()}`);
      handleLogout();
      return { success: true };
    } catch (error) {
      console.error("Failed to delete profile:", error);
      return { success: false, errors: { message: error.message } };
    }
  };

  return (
    <Context.Provider
      value={{
        avatarUrl,
        selectedAvatar,
        handlePreview,
        handleSelect,
        registerUser,
        loginUser,
        isAuthenticated,
        handleLogout,
        username,
        decodedToken,
        updateProfile,
        deleteProfile,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
