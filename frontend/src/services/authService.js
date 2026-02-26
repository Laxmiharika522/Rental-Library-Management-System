//frontend\src\services\authService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// ---------------- Login ----------------
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    return { error: error.response?.data?.error || "Login failed" };
  }
};

// ---------------- Register ----------------
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    return { error: error.response?.data?.error || "Registration failed" };
  }
};

// ---------------- Logout ----------------
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ---------------- Get User Profile ----------------
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
};

// ---------------- Update User Profile ----------------
export const updateUserProfile = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/profile`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

// ---------------- Change Password ----------------
export const changePassword = async ({ oldPassword, newPassword }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/change-password`,
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Change password error:", error);
    throw error;
  }
};
