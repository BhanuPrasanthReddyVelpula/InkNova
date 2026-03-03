import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // =====================
  // REGISTER
  // =====================
  const register = async (formData) => {
    const { data } = await API.post("/auth/register", formData);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    setUser(data);
  };

  // =====================
  // LOGIN
  // =====================
  const login = async (formData) => {
    const { data } = await API.post("/auth/login", formData);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    setUser(data);
  };

  // =====================
  // LOGOUT
  // =====================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

///activateSubscription 

  const activateSubscription = async () => {
  try {
    const { data } = await API.post("/auth/subscribe");

    setUser((prev) => ({
      ...prev,
      subscriptionActive: true,
    }));

  } catch (error) {
    console.error("Subscription failed", error);
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        register,
        login,
        logout,
        activateSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};