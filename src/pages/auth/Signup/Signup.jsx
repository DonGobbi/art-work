import React, { useState } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../../contexts/AuthProvider.js";
import { useData } from "../../../contexts/DataProvider.js";
import { toast } from "react-hot-toast";

export const Signup = () => {
  const { loading } = useData();
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const { error, signupHandler } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await signupHandler(formData);
    } catch (err) {
      // Error is already handled in AuthProvider
      console.error("Signup error:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return null;

  return (
    <div className="auth-page">
      <div className="login-container">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join Art Work to discover amazing artworks</p>
        </div>

        <form onSubmit={handleSubmit} className="login-body">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <div className="input-container">
              <input
                id="firstName"
                name="firstName"
                type="text"
                className="form-control"
                placeholder="Enter your first name"
                value={formData.firstName}
                required
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <div className="input-container">
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="form-control"
                placeholder="Enter your last name"
                value={formData.lastName}
                required
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-container">
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                required
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <input
                id="password"
                name="password"
                type={hidePassword ? "password" : "text"}
                className="form-control"
                placeholder="Create a password"
                value={formData.password}
                required
                minLength="6"
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setHidePassword(!hidePassword)}
                aria-label={hidePassword ? "Show password" : "Hide password"}
              >
                {hidePassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-container">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={hideConfirmPassword ? "password" : "text"}
                className="form-control"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                required
                minLength="6"
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setHideConfirmPassword(!hideConfirmPassword)}
                aria-label={hideConfirmPassword ? "Show password" : "Hide password"}
              >
                {hideConfirmPassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="auth-footer">
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="social-login">
              <button
                type="button"
                className="social-button"
                onClick={() => toast.error("Google signup not implemented yet")}
              >
                <FcGoogle size={20} />
                Sign up with Google
              </button>
            </div>

            <div className="auth-links">
              <span>Already have an account?</span>
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
