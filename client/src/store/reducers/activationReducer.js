import {
  HANDLING_ACTIVATION,
  HANDLE_ACTIVATION_EMAIL_FAILLURE,
  HANDLE_ACTIVATION_EMAIL_SUCCESS,
  HANDLE_ACTIVATION_CODE_FAILLURE,
  HANDLE_ACTIVATION_CODE_SUCCESS,
  GLOBAL_RESET,
  RESET_ACTIVATION
} from "../actions/actionTypes";

const INITIAL_STATE = {
  isAccountVerified: false,
  isCodeVerified: false,
  hasErrors: false,
  isLoading: false,
  message: null
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case RESET_ACTIVATION:
      return {
        ...state,
        isAccountVerified: false,
        isCodeVerified: false,
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case GLOBAL_RESET:
      return {
        ...state,
        isAccountVerified: false,
        isCodeVerified: false,
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case HANDLING_ACTIVATION:
      return {
        ...state,
        isLoading: true
      };
    case HANDLE_ACTIVATION_EMAIL_SUCCESS:
      return {
        ...state,
        isAccountVerified: true,
        isCodeVerified: false,
        hasErrors: false,
        isLoading: false,
        message: payload
      };
    case HANDLE_ACTIVATION_EMAIL_FAILLURE:
      return {
        ...state,
        isAccountVerified: false,
        isCodeVerified: false,
        hasErrors: true,
        isLoading: false,
        message: payload
      };
    case HANDLE_ACTIVATION_CODE_SUCCESS:
      return {
        ...state,
        isAccountVerified: true,
        isCodeVerified: true,
        hasErrors: false,
        isLoading: false,
        message: payload
      };
    case HANDLE_ACTIVATION_CODE_FAILLURE:
      return {
        ...state,
        isAccountVerified: true,
        isCodeVerified: false,
        hasErrors: true,
        isLoading: false,
        message: payload
      };
    default:
      return state;
  }
};
