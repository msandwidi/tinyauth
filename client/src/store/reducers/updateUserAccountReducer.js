import {
  SET_SELECTED_USER,
  GLOBAL_RESET,
  RESET_ACCOUNT_UPDATE,
  PROCESSING_ACCOUNT_ACTION,
  ACCOUNT_ACTION_SUCCESS,
  ACCOUNT_ACTION_FAILLURE
  
} from "../actions/actionTypes";

const INITIAL_STATE = {
  selectedUser: null,
  isCompleted: false,
  hasError: false,
  isLoading: false,
  message: null
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    
    case GLOBAL_RESET:
    case RESET_ACCOUNT_UPDATE:
      return {
        ...state,
        selectedUser: null,
        isCompleted: false,
        hasError: false,
        isLoading: false,
        message: null
      };

    case PROCESSING_ACCOUNT_ACTION:
      return {
        ...state,
        isLoading: true
      };

    case SET_SELECTED_USER:
      return {
        ...state,
        selectedUser: payload,
        isCompleted: false,
        hasError: false,
        isLoading: false,
        message: null
      };

    case ACCOUNT_ACTION_SUCCESS:
      return {
        ...state,
        isCompleted: true,
        hasError: false,
        isLoading: false,
        message: payload
      };

    case ACCOUNT_ACTION_FAILLURE:
      return {
        ...state,
        isCompleted: false,
        hasError: true,
        isLoading: false,
        message: payload
      };

    default:
      return state;
  }
};
