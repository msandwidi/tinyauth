import {
  RESET_UPDATE,
  GLOBAL_RESET,
  UPDATE_USER_FAILLURE,
  UPDATE_USER_SUCCESS,
  UPDATE_PASSWORD_FAILLURE,
  UPDATE_PASSWORD_SUCCESS,
  UPDATING_USER,
  CHANGE_AVATAR_FAILLURE,
  CHANGE_AVATAR_SUCCESS,
  CHANGING_AVATAR,
  UPDATING_PASSWORD
} from "../actions/actionTypes";

const INITIAL_STATE = {
  userUpdateSuccess: false,
  avatarChangeSuccess: false,
  passwordUpdateSuccess: false,
  hasError: false,
  isLoading: false,
  message: null
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case RESET_UPDATE:
      return {
        ...state,
        userUpdateSuccess: false,
        avatarChangeSuccess: false,
        passwordUpdateSuccess: false,
        hasError: false,
        isLoading: false,
        message: null
      };
    case GLOBAL_RESET:
      return {
        ...state,
        userUpdateSuccess: false,
        avatarChangeSuccess: false,
        passwordUpdateSuccess: false,
        hasError: false,
        isLoading: false,
        message: null
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
    case CHANGING_AVATAR:
      return {
        ...state,
        isLoading: true
      };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        userUpdateSuccess: true,
        avatarChangeSuccess: false,
        passwordUpdateSuccess: false,
        hasError: false,
        isLoading: false,
        message: payload.message
      };
    case CHANGE_AVATAR_SUCCESS:
      return {
        ...state,
        avatarChangeSuccess: true,
        userUpdateSuccess: false,
        passwordUpdateSuccess: false,
        hasError: false,
        isLoading: false,
        message: payload.message
      };
    case CHANGE_AVATAR_FAILLURE:
      return {
        ...state,
        avatarChangeSuccess: false,
        userUpdateSuccess: false,
        passwordUpdateSuccess: false,
        hasError: true,
        isLoading: false,
        message: payload.message
      };
    case UPDATE_USER_FAILLURE:
      return {
        ...state,
        userUpdateSuccess: false,
        avatarChangeSuccess: false,
        passwordUpdateSuccess: false,
        hasError: true,
        isLoading: false,
        message: payload.message
      };
    case UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        userUpdateSuccess: false,
        avatarChangeSuccess: false,
        passwordUpdateSuccess: true,
        hasError: false,
        isLoading: false,
        message: payload.message
      };

    case UPDATE_PASSWORD_FAILLURE:
      return {
        ...state,
        userUpdateSuccess: false,
        avatarChangeSuccess: false,
        passwordUpdateSuccess: false,
        hasError: true,
        isLoading: false,
        message: payload.message
      };

    default:
      return state;
  }
};
