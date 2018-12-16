import {
  FETCHING_DASHBOARD,
  FETCH_DASHBOARD_SUCCESS,
  FETCH_DASHBOARD_FAILLURE,
  GLOBAL_RESET
} from "../actions/actionTypes";

const INITIAL_STATE = {
  content: null,
  hasErrors: false,
  isLoading: false,
  message: null
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GLOBAL_RESET:
      return {
        ...state,
        content: null,
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case FETCHING_DASHBOARD:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_DASHBOARD_SUCCESS:
      return {
        ...state,
        content: payload,
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case FETCH_DASHBOARD_FAILLURE:
      return {
        ...state,
        hasErrors: true,
        isLoading: false,
        message: payload
      };
    default:
      return state;
  }
};
