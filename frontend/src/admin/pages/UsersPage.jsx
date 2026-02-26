//frontend\src\admin\pages\UserPage.js
import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import "../../styles/UsersPage.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: State for showing the form and handling inputs
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    full_name: ""
  });

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // NEW: Logic to add a user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await adminService.addUser(newUser);
      alert("User added successfully!");
      setShowForm(false); // Hide form after success
      setNewUser({ username: "", email: "", password: "", role: "user", full_name: "" }); // Reset
      fetchUsers(); // Refresh table
    } catch (err) {
      console.error("Failed to add user:", err);
      alert(err.response?.data?.error || "Error adding user");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This will also remove their rental history.")) return;
    try {
      await adminService.deleteUser(id);
      fetchUsers(); 
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const promoteUser = async (id) => {
    try {
      await adminService.promoteUser(id);
      fetchUsers(); 
    } catch (err) {
      console.error("Promotion failed:", err);
    }
  };

  const demoteUser = async (id) => {
    if (!window.confirm("Are you sure you want to demote this admin to a regular user?")) return;
    try {
      await adminService.demoteUser(id);
      fetchUsers(); 
    } catch (err) {
      console.error("Demotion failed:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading users...</p>;

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>Users Management</h1>
        <button className="add-toggle-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add New User"}
        </button>
      </div>

      {/* NEW: Add User Form Section */}
      {showForm && (
        <div className="add-user-card">
          <h3>Create New User</h3>
          <form className="add-user-form" onSubmit={handleAddUser}>
            <input 
              type="text" 
              placeholder="Username" 
              required 
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})} 
            />
            <input 
              type="email" 
              placeholder="Email" 
              required 
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
            />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={newUser.full_name}
              onChange={(e) => setNewUser({...newUser, full_name: e.target.value})} 
            />
            <input 
              type="password" 
              placeholder="Initial Password" 
              required 
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
            />
            <select 
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="save-btn">Save User</button>
          </form>
        </div>
      )}

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <span className={`role-badge ${u.role}`}>
                  {u.role}
                </span>
              </td>
              <td>
                {u.role === "user" ? (
                  <button className="promote-btn" onClick={() => promoteUser(u.id)}>
                    Promote
                  </button>
                ) : (
                  <button className="demote-btn" onClick={() => demoteUser(u.id)}>
                    Demote
                  </button>
                )}
                <button className="delete-btn" onClick={() => deleteUser(u.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;