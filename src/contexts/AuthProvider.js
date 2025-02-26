import React, { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { loginService } from "../services/auth-services/loginService";
import { signupService } from "../services/auth-services/signupService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState("profile");
  const [loginCredential, setLoginCredential] = useState({
    email: "",
    password: "",
  });
  const [signupCredential, setSignupCredential] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const encodedToken = localStorage.getItem("token");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const location = useLocation();

  const [auth, setAuth] = useState(
    encodedToken
      ? { token: encodedToken, isAuth: true, firstName, lastName, email }
      : { token: "", isAuth: false }
  );

  const loginHandler = async (e, email, password) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions

    try {
      setLoading(true);
      setError("");
      const response = await loginService(email, password);

      if (response.status === 200) {
        const { encodedToken, foundUser } = response.data;
        const { firstName, lastName, email } = foundUser;

        setAuth({
          token: encodedToken,
          isAuth: true,
          firstName,
          lastName,
          email,
        });

        localStorage.setItem("token", encodedToken);
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        localStorage.setItem("email", email);

        setLoginCredential({ email: "", password: "" });
        
        // First update the state and storage, then show toast and navigate
        setTimeout(() => {
          toast.success(`Welcome back, ${firstName}!`);
          navigate("/");
        }, 0);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0] || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signupHandler = async (credentials) => {
    if (loading) return; // Prevent multiple submissions

    try {
      setLoading(true);
      setError("");
      const { email, password, firstName, lastName } = credentials;
      
      if (!email || !password || !firstName || !lastName) {
        throw new Error("Please fill in all required fields");
      }

      const response = await signupService(email, password, firstName, lastName);

      if (response.status === 201) {
        setSignupCredential({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
        });
        
        // First reset the form, then show toast and navigate
        setTimeout(() => {
          toast.success(`Account created successfully! Please login to continue.`);
          navigate("/login");
        }, 0);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0] || error.message || "Signup failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutHandler = () => {
    setAuth({ token: "", isAuth: false });
    localStorage.removeItem("token");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loginHandler,
        signupHandler,
        logoutHandler,
        error,
        setError,
        loading,
        loginCredential,
        setLoginCredential,
        signupCredential,
        setSignupCredential,
        setCurrentPage,
        currentPage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
