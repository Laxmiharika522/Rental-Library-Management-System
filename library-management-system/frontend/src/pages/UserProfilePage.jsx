import React, { useState, useEffect } from "react";
import {
  getUserProfile,
  updateUserProfile,
  changePassword
} from "../services/authService";
import "../styles/UserProfilePage.css";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    address: ""
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      // Handle both Axios (res.data) and Fetch API structures
      const data = response.data || response;
      
      setUser(data);
      setFormData({
        username: data.username || "",
        email: data.email || "",
        full_name: data.full_name || "",
        phone: data.phone || "",
        address: data.address || ""
      });
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await updateUserProfile(formData);
      
      // 1. Extract the actual data returned by the server
      const updatedUser = response.data || response;

      // 2. Merge the data to prevent "N/A" if some fields are missing in response
      const finalData = {
        ...user,         // Keep old fields
        ...formData,     // Add what the user just typed
        ...updatedUser   // Overwrite with whatever the server confirmed
      };

      // 3. Update all sources of truth
      setUser(finalData);
      localStorage.setItem("user", JSON.stringify(finalData));

      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error("Update Error:", err);
      alert(err.response?.data?.error || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    try {
      await changePassword(passwordData);
      alert("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to change password");
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!user) return <div className="error">No user found. Please log in.</div>;

  return (
    <div className="profile-page">
      <h1>User Profile</h1>

      <div className="profile-card">
        <h2>Profile Details</h2>

        {editMode ? (
          <div className="edit-form">
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} />

            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />

            <label>Full Name</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} />

            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />

            <label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} />

            <div className="button-group">
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
              <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="view-details">
            <p><strong>Username:</strong> {user.username || "N/A"}</p>
            <p><strong>Email:</strong> {user.email || "N/A"}</p>
            <p><strong>Full Name:</strong> {user.full_name || "N/A"}</p>
            <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
            <p><strong>Address:</strong> {user.address || "N/A"}</p>

            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className="profile-card">
        <h2>Change Password</h2>
        <label>Old Password</label>
        <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} />

        <label>New Password</label>
        <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />

        <button className="password-btn" onClick={handleChangePassword}>
          Update Password
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage;