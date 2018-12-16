import {
  FETCHING_ADMINBOARD,
  FETCH_ADMINBOARD_SUCCESS,
  FETCH_ADMINBOARD_FAILLURE,
  GLOBAL_RESET,
  RESET_ADMINBOARD
} from "../actions/actionTypes";

const INITIAL_STATE = {
  notifications: [],
  errorReports: [],
  fraudReports: [],
  stats: [],
  hasErrors: false,
  isLoading: false,
  message: null
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GLOBAL_RESET:
      return {
        ...state,
        notifications: [],
        errorReports: [],
        fraudReports: [],
        stats: [],
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case RESET_ADMINBOARD:
      return {
        ...state,
        notifications: [],
        errorReports: [],
        fraudReports: [],
        stats: [],
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case FETCHING_ADMINBOARD:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_ADMINBOARD_SUCCESS:
      return {
        ...state,
        notifications: payload.notifications,
        errorReports: payload.errorReports,
        fraudReports: payload.fraudReports,
        stats: payload.stats,
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case FETCH_ADMINBOARD_FAILLURE:
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
