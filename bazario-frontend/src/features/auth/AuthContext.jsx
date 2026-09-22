import { createContext, useContext, useEffect, useState } from "react";

import { authService } from "@/features/auth/authService";
import { clearTokens, getTokens, setTokens } from "@/utils/tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(getTokens().role);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { access } = getTokens();
    if (!access) {
      setLoading(false);
      return;
    }
    authService
      .fetchMe()
      .then(setUser)
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  function login({ access, refresh, user: userData }, loggedInRole) {
    setTokens({ access, refresh, role: loggedInRole });
    setUser(userData);
    setRole(loggedInRole);
  }

  function logout() {
    clearTokens();
    setUser(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
