import React from 'react';
import { isJsonString } from 'utils/helpers';
import { CookieStorage } from '../utils/cookie-storage';
import { StorageKeys } from '../constants/storage-keys';

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, isAuthenticated: true, userInfo: action?.data?.user };
    // case "LOGIN_FAILURE":
    //   return { ...state, isAuthenticated: false };
    case 'SIGN_OUT_SUCCESS':
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  const userInfo = CookieStorage.getCookieData(StorageKeys.UserInfo);

  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: CookieStorage.isAuthenticated(),
    userInfo: userInfo,
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserProvider');
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error('useUserDispatch must be used within a UserProvider');
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

async function loginUser(dispatch, token, user) {
  CookieStorage.setCookieData(StorageKeys.AccessToken, token);
  CookieStorage.setCookieData(StorageKeys.UserInfo, JSON.stringify(user));

  dispatch({ type: 'LOGIN_SUCCESS', data: { user } });
}

function signOut(dispatch, history) {
  CookieStorage.clearSession();
  dispatch({ type: 'SIGN_OUT_SUCCESS' });
  window.location.href = '/';
}
