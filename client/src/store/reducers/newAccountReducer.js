import {
  CREATING_NEW_ACCOUNT,
  CREATE_NEW_ACCOUNT_SUCCESS,
  CREATE_NEW_ACCOUNT_FAILLURE,
  GLOBAL_RESET,
  RESET_ACCOUNT_CREATION
} from "../actions/actionTypes";

const INITIAL_STATE = {
  newUserAddedSuccess: false,
  hasErrors: false,
  isLoading: false,
  message: null
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case RESET_ACCOUNT_CREATION:
      return {
        ...state,
        newUserAddedSuccess: false,
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case GLOBAL_RESET:
      return {
        ...state,
        newUserAddedSuccess: false,
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case CREATING_NEW_ACCOUNT:
      return {
        ...state,
        isLoading: true
      };
    case CREATE_NEW_ACCOUNT_SUCCESS:
      return {
        ...state,
        newUserAddedSuccess: true,
        hasErrors: false,
        isLoading: false,
        message: payload
      };
    case CREATE_NEW_ACCOUNT_FAILLURE:
      return {
        ...state,
        newUserAddedSuccess: false,
        hasErrors: true,
        isLoading: false,
        message: payload
      };
    default:
      return state;
  }
};
