import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../../contexts/AuthProvider.js";
import { useData } from "../../../contexts/DataProvider.js";
import { toast } from "react-hot-toast";

// Default test account credentials
const TEST_CREDENTIALS = {
  email: "test@gmail.com",
  password: "test123",
};

export const Login = () => {
  const { loading } = useData();
  const [hidePassword, setHidePassword] = useState(true);
  const { error, loginHandler } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await loginHandler(e, formData.email, formData.password);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleTestLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    try {
      await loginHandler(e, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
      toast.success("Test login successful!");
    } catch (err) {
      console.error("Test login error:", err);
      toast.error("Test login failed. Please try again.");
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
          <h2>Welcome Back</h2>
          <p>Sign in to continue to Art Work</p>
        </div>

        <form onSubmit={handleSubmit} className="login-body">
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
                autoComplete="email"
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
                placeholder="Enter your password"
                value={formData.password}
                required
                onChange={handleInputChange}
                autoComplete="current-password"
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

          {error && <div className="error-message">{error}</div>}

          <div className="auth-footer">
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <button
              type="button"
              className="test-login-button"
              onClick={handleTestLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In with Test Account"}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="social-button"
              onClick={() => toast.error("Google login not implemented yet")}
            >
              <FcGoogle size={24} />
              Sign in with Google
            </button>

            <div className="auth-links">
              <Link to="/forgot-password" className="auth-link">
                Forgot Password?
              </Link>
              <div className="signup-link">
                <span>Don't have an account?</span>
                <Link to="/signup" className="auth-link">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
