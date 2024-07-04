import { createContext, useContext, useReducer } from "react";

// Create a context for storing authentication state
const AppContext = createContext(null);

// Create a separate context for dispatching actions related to authentication
const AppDispatchContext = createContext(null);

// Provider component that wraps the application and manages the authentication state
export function AppProvider({ children }) {
  // Define the initial state for authentication
  const initialAuth = {
    username: "",
    credits: 0,
  };

  // Define the reducer function that handles state transitions based on actions
  const [auth, dispatch] = useReducer(appReducer, initialAuth);

  return (
      <AppContext.Provider value={auth}>
        <AppDispatchContext.Provider value={dispatch}>
          {children}
        </AppDispatchContext.Provider>
      </AppContext.Provider>
  );
}

// Custom hook to access the authentication state from the context
export function useAuth() {
  return useContext(AppContext);
}

// Custom hook to access the dispatch function for authentication actions from the context
export function useAuthDispatch() {
  return useContext(AppDispatchContext);
}

// Reducer function that specifies how the authentication state should change in response to actions
function appReducer(auth, action) {
  switch (action.type) {
    case "logout": {
      return {
        username: "",
        credits: 0,
      };
    }
    case "login": {
      return {
        username: action.username,
        credits: action.credits,
      };
    }
    case "signup": {
      return {
        username: action.username,
        credits: 0,
      };
    }
    case "addCredits": {
      return {
        username: auth.username,
        credits: auth.credits + action.credits,
      };
    }
    case "removeCredits": {
      return {
        username: auth.username,
        credits: auth.credits - action.credits,
      };
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
}

// Initial state for authentication
const initialAuth = {
  username: "",
  credits: 0,
};
