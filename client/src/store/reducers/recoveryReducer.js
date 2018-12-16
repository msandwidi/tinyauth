import {
  PREPARE_RECOVERY,
  HANDLING_RECOVERY,
  HANDLE_RECOVERY_EMAIL_FAILLURE,
  HANDLE_RECOVERY_EMAIL_SUCCESS,
  HANDLING_RESET_CODE,
  HANDLE_RESET_CODE_SUCCESS,
  HANDLING_NEW_PASSWORD,
  HANDLE_NEW_PASSWORD_SUCCESS,
  HANDLE_NEW_PASSWORD_FAILLURE,
  HANDLE_RESET_CODE_FAILLURE,
  HANDLE_NO_RESET_TOKEN,
  GLOBAL_RESET,
  RESET_RECOVERY
} from "../actions/actionTypes";

const INITIAL_STATE = {
  isEmailSent: false,
  isCodeVerified: false,
  isPasswordChanged: false,
  isLoading: false,
  hasError: false,
  message: null
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case RESET_RECOVERY:
      return {
        ...state,
        isEmailSent: false,
        isCodeVerified: false,
        isPasswordChanged: false,
        isLoading: false,
        hasError: false,
        message: null
      };
    case GLOBAL_RESET:
      return {
        ...state,
        isEmailSent: false,
        isCodeVerified: false,
        isPasswordChanged: false,
        isLoading: false,
        hasError: false,
        message: null
      };
    case PREPARE_RECOVERY:
      return {
        ...state,
        isEmailSent: false,
        isCodeVerified: false,
        isPasswordChanged: false,
        isLoading: false,
        hasError: false,
        message: null
      };
    case HANDLING_RECOVERY:
      return {
        ...state,
        isLoading: true
      };
    case HANDLE_RECOVERY_EMAIL_SUCCESS:
      return {
        ...state,
        isEmailSent: true,
        isCodeVerified: false,
        isPasswordChanged: false,
        isLoading: false,
        hasError: false,
        message: payload
      };
    case HANDLE_RECOVERY_EMAIL_FAILLURE:
      return {
        ...state,
        isEmailSent: false,
        isCodeVerified: false,
        isPasswordChanged: false,
        hasError: true,
        isLoading: false,
        message: payload
      };
    case HANDLING_RESET_CODE:
      return {
        ...state,
        isLoading: true
      };
    case HANDLE_RESET_CODE_SUCCESS:
      return {
        ...state,
        isEmailSent: true,
        isCodeVerified: true,
        isPasswordChanged: false,
        hasError: false,
        isLoading: false,
        message: payload
      };
    case HANDLE_RESET_CODE_FAILLURE:
      return {
        ...state,
        isEmailSent: true,
        isCodeVerified: false,
        isPasswordChanged: false,
        hasError: true,
        isLoading: false,
        message: payload
      };
    case HANDLING_NEW_PASSWORD:
      return {
        ...state,
        isLoading: true
      };
    case HANDLE_NEW_PASSWORD_SUCCESS:
      return {
        ...state,
        isEmailSent: true,
        isCodeVerified: true,
        isPasswordChanged: true,
        hasError: false,
        isLoading: false,
        message: payload
      };
    case HANDLE_NEW_PASSWORD_FAILLURE:
      return {
        ...state,
        isEmailSent: true,
        isCodeVerified: true,
        isPasswordChanged: false,
        hasError: true,
        isLoading: false,
        message: payload
      };
    case HANDLE_NO_RESET_TOKEN:
      return {
        ...state,
        isEmailSent: false,
        isCodeVerified: false,
        isPasswordChanged: false,
        isLoading: false,
        hasError: true,
        message: payload
      };
    default:
      return state;
  }
};
