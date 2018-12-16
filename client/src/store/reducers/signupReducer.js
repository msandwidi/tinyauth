import {
  HANDLING_SIGNUP,
  HANDLE_SIGNUP_FAILLURE,
  HANDLE_SIGNUP_SUCCESS,
  GLOBAL_RESET,
  RESET_SIGNUP
} from "../actions/actionTypes";

const INITIAL_STATE = {
  isCompleted: false,
  hasErrors: false,
  isLoading: false,
  message: null
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case RESET_SIGNUP:
      return {
        ...state,
        isCompleted: false,
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case GLOBAL_RESET:
      return {
        ...state,
        isCompleted: false,
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case HANDLING_SIGNUP:
      return {
        ...state,
        isCompleted: false,
        hasErrors: false,
        isLoading: true,
        message: null
      };
    case HANDLE_SIGNUP_SUCCESS:
      return {
        ...state,
        isCompleted: true,
        hasErrors: false,
        isLoading: false,
        message: payload
      };
    case HANDLE_SIGNUP_FAILLURE:
      return {
        ...state,
        isCompleted: false,
        hasErrors: true,
        isLoading: false,
        message: payload
      };
    default:
      return state;
  }
};
