import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../../contexts/AuthProvider.js";
import { useData } from "../../../contexts/DataProvider.js";
import { toast } from "react-hot-toast";

export const Signup = () => {
  const { loading } = useData();
  const navigate = useNavigate();
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error, signupHandler } = useAuth();
  const [signupCredential, setSignupCredential] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (signupCredential.password !== signupCredential.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await signupHandler(signupCredential);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(error || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    // Implement Google OAuth signup
    toast.error("Google signup not implemented yet");
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
                type="text"
                className="form-control"
                placeholder="Enter your first name"
                value={signupCredential.firstName}
                required
                onChange={(e) =>
                  setSignupCredential({
                    ...signupCredential,
                    firstName: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <div className="input-container">
              <input
                id="lastName"
                type="text"
                className="form-control"
                placeholder="Enter your last name"
                value={signupCredential.lastName}
                required
                onChange={(e) =>
                  setSignupCredential({
                    ...signupCredential,
                    lastName: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-container">
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={signupCredential.email}
                required
                onChange={(e) =>
                  setSignupCredential({
                    ...signupCredential,
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
                placeholder="Create a password"
                value={signupCredential.password}
                required
                minLength="6"
                onChange={(e) =>
                  setSignupCredential({
                    ...signupCredential,
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
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-container">
              <input
                id="confirmPassword"
                type={hideConfirmPassword ? "password" : "text"}
                className="form-control"
                placeholder="Confirm your password"
                value={signupCredential.confirmPassword}
                required
                minLength="6"
                onChange={(e) =>
                  setSignupCredential({
                    ...signupCredential,
                    confirmPassword: e.target.value,
                  })
                }
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
              disabled={isSubmitting || !signupCredential.email || !signupCredential.password || !signupCredential.confirmPassword}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="social-login">
              <button
                type="button"
                className="social-button"
                onClick={handleGoogleSignup}
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
