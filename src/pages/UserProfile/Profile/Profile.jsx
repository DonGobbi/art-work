import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthProvider.js";
import { useUserData } from "../../../contexts/UserDataProvider.js";
import { toast } from "react-hot-toast";
import "./Profile.css";

export const Profile = () => {
  const { auth, setAuth } = useAuth();
  const { dispatch } = useUserData();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("token");
    setAuth({ token: "", isAuth: false });
    toast.success("You're logged out successfully!");
    dispatch({ type: "SET_CART", payload: [] });
    dispatch({ type: "SET_WISHLIST", payload: [] });
    navigate("/");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Welcome Back!</h2>
        <p>Manage your personal information and preferences</p>
      </div>
      
      <div className="profile-details">
        <div className="profile-field">
          <span className="field-label">First Name</span>
          <span className="field-value">{auth.firstName}</span>
        </div>

        <div className="profile-field">
          <span className="field-label">Last Name</span>
          <span className="field-value">{auth.lastName}</span>
        </div>

        <div className="profile-field">
          <span className="field-label">Email</span>
          <span className="field-value">{auth.email}</span>
        </div>

        <div className="profile-field">
          <span className="field-label">Member Since</span>
          <span className="field-value">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="logout-section">
        <button className="logout-button" onClick={handleLogout}>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
