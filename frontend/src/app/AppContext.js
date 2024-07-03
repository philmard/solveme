import { createContext, useContext, useReducer } from "react";

const AppContext = createContext(null);

const AppDispatchContext = createContext(null);

export function AppProvider({ children }) {
  const [auth, dispatch] = useReducer(appReducer, initialAuth);

  return (
    <AppContext.Provider value={auth}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

export function useAuth() {
  return useContext(AppContext);
}

export function useAuthDispatch() {
  return useContext(AppDispatchContext);
}

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

const initialAuth = {
  username: "",
  credits: 0,
};
