import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load saved user from localStorage on mount
  useEffect(() => {
    let user = localStorage.getItem("userInfo");
    setUser(user ? JSON.parse(user) : null);
  }, []);

  // ✅ Function to login user (used after successful login/signup)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  // ✅ Function to logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
