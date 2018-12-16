import {
	GLOBAL_RESET,
	RESET_ACCOUNT_MANAGEMENT,
	FETCHING_ACCOUNTS_MANAGEMENT,
	FETCH_ACCOUNTS_MANAGEMENT_SUCCESS,
	FETCH_ACCOUNTS_MANAGEMENT_FAILLURE,
	SEARCH_ACCOUNTS_SUCCESS,
	RESET_ACCOUNT_SEARCH,
	FETCHING_ACCOUNT_INFO,
	FETCH_ACCOUNT_INFO_SUCCESS,
	FETCH_ACCOUNT_INFO_FAILLURE,
	SET_SELECTED_USER,
	UPDATE_ACCOUNTLIST_SUCCESS
} from '../actions/actionTypes';

const INITIAL_STATE = {
	accountsList: [],
	activityLogs: [],
	hasErrors: false,
	isLoading: false,
	message: null
};

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case GLOBAL_RESET:
			return {
				...state,
				accountsList: [],
				activityLogs: [],
				hasErrors: false,
				isLoading: false,
				message: null
			};
		case RESET_ACCOUNT_MANAGEMENT:
			return {
				...state,
				accountsList: [],
				activityLogs: [],
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
				accountsList: payload,
				hasErrors: false,
				isLoading: false,
				message: null
			};
    case UPDATE_ACCOUNTLIST_SUCCESS:
			return {
				...state,
				accountsList: payload,
				hasErrors: false,
				isLoading: false,
				message: null
			};
		case SEARCH_ACCOUNTS_SUCCESS:
			let prevState = state;
			let allAccounts = [];
			if (prevState.allAccounts && prevState.accountsList.length <= prevState.allAccounts.length) {
				allAccounts = [ ...prevState.allAccounts ];
			} else {
				allAccounts = [ ...prevState.accountsList ];
			}
			return {
				...prevState,
				allAccounts,
				accountsList: payload,
				hasErrors: false,
				isLoading: false,
				message: null
			};
		case RESET_ACCOUNT_SEARCH:
			let prev = state;
			if (prev.allAccounts && prev.allAccounts.length >= prev.accountsList.length) {
				let accountsList = prev.allAccounts;
				return {
					...prev,
					accountsList,
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
		case FETCHING_ACCOUNT_INFO:
			return {
				...state,
				isLoading: true
			};
		case FETCH_ACCOUNT_INFO_SUCCESS:
			return {
				...state,
				selectedUser: payload,
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
				selectedUser: payload,
				hasErrors: false,
				isLoading: false,
				message: null
			};
		default:
			return state;
	}
};
