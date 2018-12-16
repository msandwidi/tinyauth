import {
  FETCHING_ADMIN_BOARD,
  FETCH_ADMIN_BOARD_SUCCESS,
  FETCH_ADMIN_BOARD_FAILLURE,
  GLOBAL_RESET,
  RESET_ADMIN,
  FETCHING_ACCOUNTS_MANAGEMENT,
  FETCH_ACCOUNTS_MANAGEMENT_SUCCESS,
  FETCH_ACCOUNTS_MANAGEMENT_FAILLURE,
  SEARCH_ACCOUNTS_SUCCESS,
  RESET_ACCOUNT_SEARCH,
  FETCHING_ACCOUNT_INFO,
  FETCH_ACCOUNT_INFO_SUCCESS,
  FETCH_ACCOUNT_INFO_FAILLURE,
  SET_SELECTED_USER
} from "../actions/actionTypes";

const INITIAL_STATE = {
  adminBoard: {},
  accountsManagement: {},
  hasErrors: false,
  isLoading: false,
  message: null
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GLOBAL_RESET:
      return {
        ...state,
        adminBoard: {},
        accountsManagement: {},
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case RESET_ADMIN:
      return {
        ...state,
        adminBoard: {},
        accountsManagement: {},
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case FETCHING_ACCOUNTS_MANAGEMENT:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_ACCOUNTS_MANAGEMENT_SUCCESS:
      return {
        ...state,
        accountsManagement: payload,
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case SEARCH_ACCOUNTS_SUCCESS:
      let prevState = state.accountsManagement;
      let allAccounts = [];
      if (
        prevState.allAccounts &&
        prevState.accountsList.length <= prevState.allAccounts.length
      ) {
        allAccounts = [...prevState.allAccounts];
      } else {
        allAccounts = [...prevState.accountsList];
      }
      return {
        ...state,
        accountsManagement: {
          ...prevState,
          allAccounts,
          accountsList: payload
        },
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case RESET_ACCOUNT_SEARCH:
      let prev = state.accountsManagement;
      if (
        prev.allAccounts &&
        prev.allAccounts.length >= prev.accountsList.length
      ) {
        let accountsList = prev.allAccounts;
        return {
          ...state,
          accountsManagement: { ...prev, accountsList },
          hasErrors: false,
          isLoading: false,
          message: null
        };
      }
      return {
        ...state
      };
    case FETCH_ACCOUNTS_MANAGEMENT_FAILLURE:
      return {
        ...state,
        hasErrors: true,
        isLoading: false,
        message: payload
      };
    case FETCHING_ADMIN_BOARD:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_ADMIN_BOARD_SUCCESS:
      return {
        ...state,
        adminBoard: payload,
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case FETCH_ADMIN_BOARD_FAILLURE:
      return {
        ...state,
        hasErrors: true,
        isLoading: false,
        message: payload
      };
    case FETCHING_ACCOUNT_INFO:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_ACCOUNT_INFO_SUCCESS:
      return {
        ...state,
        accountsManagement: {
          ...state.accountsManagement,
          selectedUser: payload
        },
        hasErrors: false,
        isLoading: false,
        message: null
      };
    case FETCH_ACCOUNT_INFO_FAILLURE:
      return {
        ...state,
        hasErrors: true,
        isLoading: false,
        message: payload
      };
    case SET_SELECTED_USER:
      return {
        ...state,
        accountsManagement: {
          ...state.accountsManagement,
          selectedUser: payload
        },
        hasErrors: false,
        isLoading: false,
        message: null
      };
    default:
      return state;
  }
};
