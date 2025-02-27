import axios from "axios";

export const loginService = async (email, password) => {
  try {
    const response = await axios.post("/api/auth/login", {
      email,
      password,
    });
    
    if (!response.data || !response.data.foundUser) {
      throw new Error("Invalid response from server");
    }
    
    return response;
  } catch (error) {
    if (error.response?.data?.errors) {
      console.error("Login service error:", error.response.data.errors[0]);
    } else {
      console.error("Login service error:", error.message);
    }
    throw error;
  }
};
