// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client.js";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const getRedirectPath = (role) =>
  role === "admin" || role === "superAdmin" ? "/admin" : "/dashboard";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [otpEmail, setOtpEmail] = useState(null);
  const [loading, setLoading] = useState(true); // 🔴 IMPORTANT
  const navigate = useNavigate();

  /* ===== RESTORE SESSION ===== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false); // 🔴 VERY IMPORTANT
  }, []);

  /* ===== REGISTER ===== */
  const register = async (form) => {
    await client.post("/auth/register", form);
    setOtpEmail(form.email);
    navigate("/verify-signup-otp");
  };

  /* ===== VERIFY SIGNUP OTP ===== */
  const verifySignupOtp = async (otp) => {
    await client.post("/auth/verify-otp", { email: otpEmail, otp });
    navigate("/login");
  };

  /* ===== LOGIN ===== */
  const login = async (email, password) => {
    await client.post("/auth/login", { email, password });
    setOtpEmail(email);
    navigate("/verify-login-otp");
  };

  /* ===== VERIFY LOGIN OTP ===== */
  const verifyLoginOtp = async (otp) => {
    const { data } = await client.post("/auth/verify-login-otp", {
      email: otpEmail,
      otp,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
    navigate(getRedirectPath(data.user.role));
  };

  /* ===== LOGOUT ===== */
  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading, // 🔴 EXPOSE LOADING
        register,
        login,
        verifySignupOtp,
        verifyLoginOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
