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
        toast.success(`Welcome back, ${firstName}!`);
        navigate(location?.state?.from?.pathname || "/");
      }
    } catch (error) {
      setError(error.response?.data?.errors?.[0] || "Login failed. Please try again.");
      toast.error(error.response?.data?.errors?.[0] || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signupHandler = async (credentials) => {
    try {
      setLoading(true);
      setError("");
      const { email, password, firstName, lastName } = credentials;
      const response = await signupService(email, password, firstName, lastName);

      if (response.status === 201) {
        const { encodedToken, createdUser } = response.data;
        toast.success(`Welcome to Art Work, ${createdUser.firstName}!`);
        setSignupCredential({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
        });
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.errors?.[0] || "Signup failed. Please try again.");
      toast.error(error.response?.data?.errors?.[0] || "Signup failed. Please try again.");
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
