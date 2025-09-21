import { createContext, useContext, useState } from "react";

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const showSessionExpired = () => {
    setIsSessionExpired(true);
  };

  const hideSessionExpired = () => {
    setIsSessionExpired(false);
  };

  const value = {
    isSessionExpired,
    showSessionExpired,
    hideSessionExpired,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
