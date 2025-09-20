import { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case "AUTH_RESET":
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authAPI.getMe();
          if (response.data.success) {
            dispatch({
              type: "AUTH_SUCCESS",
              payload: {
                user: response.data.data.user,
                token: token,
              },
            });
          } else {
            localStorage.removeItem("token");
            dispatch({ type: "LOGOUT" });
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("token");
          dispatch({ type: "LOGOUT" });
        }
      } else {
        dispatch({ type: "LOGOUT" });
      }
    };

    checkAuth();
  }, []); // Remove state.token dependency to prevent infinite loop

  const login = async (credentials) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await authAPI.login(credentials);
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem("token", token);
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user, token },
        });
        toast.success("Login berhasil!");
        return { success: true };
      } else {
        dispatch({
          type: "AUTH_FAILURE",
          payload: response.data.message,
        });
        toast.error(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Terjadi kesalahan saat login";
      dispatch({
        type: "AUTH_FAILURE",
        payload: message,
      });
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await authAPI.register(userData);
      if (response.data.success) {
        // Reset loading state after successful registration
        dispatch({ type: "AUTH_RESET" });
        return { success: true };
      } else {
        dispatch({
          type: "AUTH_FAILURE",
          payload: response.data.message,
        });
        toast.error(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Terjadi kesalahan saat registrasi";
      dispatch({
        type: "AUTH_FAILURE",
        payload: message,
      });
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      if (state.token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
      toast.success("Logout berhasil!");
    }
  };

  const updateUser = (userData) => {
    dispatch({
      type: "UPDATE_USER",
      payload: userData,
    });
  };

  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      if (response.data.success) {
        const { token } = response.data.data;
        localStorage.setItem("token", token);
        return token;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
