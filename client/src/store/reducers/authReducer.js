import {
  FETCHING_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILLURE,
  HANDLING_LOGIN,
  HANDLE_LOGIN_FAILLURE,
  HANDLE_LOGIN_SUCCESS,
  HANDLE_NO_TOKEN,
  HANDLING_LOGOUT,
  HANDLE_LOGOUT_SUCCESS,
  HANDLE_LOGOUT_FAILLURE,
  RESET_USER,
  GLOBAL_RESET,
  UPDATING_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILLURE,
  UPDATING_PASSWORD,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILLURE,
  RESET_UPDATE
} from "../actions/actionTypes";

const INITIAL_STATE = {
  user: null,
  updated: false,
  isLoggedIn: false,
  hasError: false,
  isLoading: false,
  message: null
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GLOBAL_RESET:
      return {
        ...state,
        user: null,
        hasError: false,
        isLoggedIn: false,
        isLoading: false,
        message: null
      };
    case RESET_UPDATE:
      return {
        ...state,
        isLoading: false,
        updated: false,
        hasError: false,
        message: null
      };
    case FETCHING_USER:
      return {
        ...state,
        isLoading: true
      };
    case UPDATING_USER:
      return {
        ...state,
        isLoading: true
      };
    case UPDATING_PASSWORD:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        user: payload,
        updated: false,
        hasError: false,
        isLoggedIn: true,
        isLoading: false,
        message: null
      };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        user: payload.user,
        updated: true,
        hasError: false,
        isLoggedIn: true,
        isLoading: false,
        message: null
      };
    case UPDATE_USER_FAILLURE:
      return {
        ...state,
        updated: false,
        hasError: true,
        isLoading: false,
        message: payload
      };
    case UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        updated: true,
        hasError: false,
        isLoggedIn: true,
        isLoading: false,
        message: null
      };
    case UPDATE_PASSWORD_FAILLURE:
      return {
        ...state,
        updated: false,
        hasError: true,
        isLoading: false,
        message: payload
      };
    case FETCH_USER_FAILLURE:
      return {
        ...state,
        user: null,
        updated: false,
        hasError: true,
        isLoggedIn: false,
        isLoading: false,
        message: payload
      };
    case HANDLE_NO_TOKEN:
      return {
        ...state,
        user: null,
        updated: false,
        hasError: true,
        isLoggedIn: false,
        isLoading: false,
        message: payload
      };
    case HANDLING_LOGOUT:
      return {
        ...state,
        user: null,
        updated: false,
        hasError: false,
        isLoggedIn: false,
        isLoading: true,
        message: null
      };

    case HANDLE_LOGOUT_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case HANDLE_LOGOUT_FAILLURE:
      return {
        ...state,
        user: null,
        updated: false,
        isLoggedIn: false,
        isLoading: false,
        hasError: true,
        message: payload
      };
    case HANDLING_LOGIN:
      return {
        ...state,
        user: null,
        updated: false,
        isLoggedIn: false,
        hasError: false,
        isLoading: true,
        message: null
      };
    case HANDLE_LOGIN_SUCCESS:
      return {
        ...state,
        user: payload,
        updated: false,
        isLoggedIn: true,
        hasError: false,
        isLoading: false,
        message: null
      };
    case HANDLE_LOGIN_FAILLURE:
      return {
        ...state,
        user: null,
        updated: false,
        isLoggedIn: false,
        hasError: true,
        isLoading: false,
        message: payload
      };
    case RESET_USER:
      return {
        ...state,
        user: null,
        updated: false,
        isLoggedIn: false,
        hasError: false,
        isLoading: false,
        message: null
      };
    default:
      return state;
  }
};
