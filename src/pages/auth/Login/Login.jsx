import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../../contexts/AuthProvider.js";
import { useData } from "../../../contexts/DataProvider.js";
import { toast } from "react-hot-toast";

export const Login = () => {
  const { loading } = useData();
  const navigate = useNavigate();
  const [hidePassword, setHidePassword] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error, loginCredential, setLoginCredential, loginHandler } = useAuth();

  const { email, password } = loginCredential;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await loginHandler(e, email, password);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(error || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await loginHandler(e, "aniketsaini65@gmail.com", "aniketSaini258");
      toast.success("Test login successful!");
      navigate("/");
    } catch (err) {
      toast.error(error || "Test login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth login
    toast.error("Google login not implemented yet");
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
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={loginCredential.email}
                required
                onChange={(e) =>
                  setLoginCredential({
                    ...loginCredential,
                    email: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <input
                id="password"
                type={hidePassword ? "password" : "text"}
                className="form-control"
                placeholder="Enter your password"
                value={loginCredential.password}
                required
                onChange={(e) =>
                  setLoginCredential({
                    ...loginCredential,
                    password: e.target.value,
                  })
                }
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
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="auth-footer">
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || !email || !password}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            <button
              type="button"
              className="submit-button test-login"
              onClick={handleTestLogin}
              disabled={isSubmitting}
            >
              Sign In with Test Account
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="social-login">
              <button
                type="button"
                className="social-button"
                onClick={handleGoogleLogin}
              >
                <FcGoogle size={20} />
                Continue with Google
              </button>
            </div>

            <div className="auth-links">
              <Link to="/forgot-password" className="auth-link">
                Forgot Password?
              </Link>
              <Link to="/signup" className="auth-link">
                Create Account
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
