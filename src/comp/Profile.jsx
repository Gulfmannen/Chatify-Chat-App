import { useState, useContext, useEffect } from "react";
import { Context } from "../ContextProvider/ContextProvider";

const Profile = () => {
  const {
    decodedToken,
    updateProfile,
    deleteProfile,
    handlePreview,
    handleSelect,
  } = useContext(Context);

  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    avatar: "",
    userId: null,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  useEffect(() => {
    if (decodedToken) {
      setUserDetails({
        username: decodedToken.user || "",
        email: decodedToken.email || "",
        avatar: decodedToken.avatar || "",
        userId: decodedToken.id || null,
      });
    }
  }, [decodedToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const generatePreview = () => {
    const url = `https://i.pravatar.cc/150?img=${Math.floor(
      Math.random() * 70
    )}`;
    setPreviewUrl(url);
    handlePreview(url);
  };

  const handleUpdate = async () => {
    const { username, email, avatar, userId } = userDetails;
    const result = await updateProfile(username, email, avatar, userId);
    alert(
      result.success
        ? "Profile updated successfully!"
        : `Failed to update profile: ${result.errors.message}`
    );
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      const result = await deleteProfile(userDetails.userId);
      alert(
        result.success
          ? "Account deleted successfully."
          : `Failed to delete account: ${result.errors.message}`
      );
    }
  };

  return (
    <div>
      <h2>Profile Options</h2>
      <div>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={userDetails.username}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          E-mail:
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        {previewUrl && (
          <div>
            <h4>Preview:</h4>
            <img
              src={previewUrl}
              alt="Avatar Preview"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                margin: "10px 0",
              }}
            />
            <button
              onClick={() => {
                setUserDetails((prev) => ({ ...prev, avatar: previewUrl }));
                handleSelect(previewUrl);
              }}
            >
              Select your Avatar
            </button>
          </div>
        )}
        <button onClick={generatePreview}>Preview Random Avatar</button>
      </div>
      <button onClick={handleUpdate}>Update Profile</button>
      <button onClick={handleDelete} style={{ color: "red" }}>
        Delete/Remove Account
      </button>
    </div>
  );
};

export default Profile;
