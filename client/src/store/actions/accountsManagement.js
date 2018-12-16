import axios from 'axios';

import {
	FETCHING_ACCOUNTS_MANAGEMENT,
	FETCH_ACCOUNTS_MANAGEMENT_FAILLURE,
	FETCH_ACCOUNTS_MANAGEMENT_SUCCESS,
	HANDLE_NO_TOKEN,
	SEARCHING_ACCOUNTS,
	SEARCH_ACCOUNTS_SUCCESS,
	SEARCH_ACCOUNTS_FAILLURE,
	RESET_ACCOUNT_SEARCH,
	SEARCHING_LOGS,
	SEARCH_LOGS_SUCCESS,
	RESET_LOGS_SEARCH,
	SEARCH_LOGS_FAILLURE,
	FETCHING_ACCOUNT_INFO,
	FETCH_ACCOUNT_INFO_SUCCESS,
	FETCH_ACCOUNT_INFO_FAILLURE,
	RESET_ACCOUNT_MANAGEMENT
} from './actionTypes';

const { API_BASE_ROOT } = require('../../config/api');

const ADMIN_BASE_URL = `${API_BASE_ROOT}/v1/admin`;

const URLs = {
	fetchAccounts: ADMIN_BASE_URL + `/accounts/accounts-management`,
	fetchAccountDetails: ADMIN_BASE_URL + `/accounts/account-details`,
	findLogs: ADMIN_BASE_URL + `/accounts/find-logs`
};

export const fetchAccountsManagement = () => async (dispatch) => {
	try {
		const candidateToken = localStorage.getItem('authToken');

		if (!candidateToken || candidateToken === '') {
			localStorage.clear();
			sessionStorage.clear();
			return await dispatch({
				type: HANDLE_NO_TOKEN
			});
		}

		dispatch({
			type: FETCHING_ACCOUNTS_MANAGEMENT
		});

		const res = await axios.get(URLs.fetchAccounts, {
			headers: {
				Authorization: `Bearer ${candidateToken}`
			}
		});

		if (res.status === 200 && res.data.success) {
			return await dispatch({
				type: FETCH_ACCOUNTS_MANAGEMENT_SUCCESS,
				payload: res.data.accounts
			});
		}
		return await dispatch({
			type: FETCH_ACCOUNTS_MANAGEMENT_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		if (error.response.status === 500) {
			localStorage.clear();
			sessionStorage.clear();
		}
		return await dispatch({
			type: FETCH_ACCOUNTS_MANAGEMENT_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const fetchAccountInfo = (data) => async (dispatch) => {
	try {
		const candidateToken = localStorage.getItem('authToken');

		if (!candidateToken || candidateToken === '') {
			localStorage.clear();
			sessionStorage.clear();
			return await dispatch({
				type: HANDLE_NO_TOKEN
			});
		}

		dispatch({
			type: FETCHING_ACCOUNT_INFO
		});

		const res = await axios.get(URLs.fetchAccountDetails + `/${data}`, {
			headers: {
				Authorization: `Bearer ${candidateToken}`
			}
		});

		if (res.status === 200 && res.data.success) {
			return await dispatch({
				type: FETCH_ACCOUNT_INFO_SUCCESS,
				payload: res.data.user
			});
		}
		return await dispatch({
			type: FETCH_ACCOUNT_INFO_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		return await dispatch({
			type: FETCH_ACCOUNT_INFO_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const searchLogs = (data) => async (dispatch) => {
	try {
		const candidateToken = localStorage.getItem('authToken');

		if (!candidateToken || candidateToken === '') {
			localStorage.clear();
			sessionStorage.clear();
			return await dispatch({
				type: HANDLE_NO_TOKEN
			});
		}

		dispatch({
			type: SEARCHING_LOGS
		});

		const res = await axios.post(URLs.findLogs, data, {
			headers: {
				Authorization: `Bearer ${candidateToken}`
			}
		});

		if (res.status === 200 && res.data.success) {
			return await dispatch({
				type: SEARCH_LOGS_SUCCESS,
				payload: res.data.logsList
			});
		}
		return await dispatch({
			type: SEARCH_LOGS_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		return await dispatch({
			type: SEARCH_LOGS_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const searchAccount = (data, accountsManagement) => async (dispatch) => {
	try {
		const { accountsList, allAccounts } = accountsManagement;
		let source;
		if (!allAccounts || accountsList.length >= allAccounts.length) {
			source = [ ...accountsList ];
		} else {
			source = [ ...allAccounts ];
		}
		const candidateToken = localStorage.getItem('authToken');
		if (!candidateToken || candidateToken === '') {
			localStorage.clear();
			sessionStorage.clear();
			return await dispatch({
				type: HANDLE_NO_TOKEN
			});
		}
		const { email, phoneNumber, name } = data;
		dispatch({
			type: SEARCHING_ACCOUNTS
		});

		const searchByEmail = () =>
			source.filter((account) => account.email.toLowerCase().search(email.trim().toLowerCase()) !== -1);

		const searchByPhoneNumber = () =>
			source.filter((account) => {
				if (account.phoneNumber) {
					return account.phoneNumber.toString().search(phoneNumber.trim()) !== -1;
				}
				return null;
			});

		const searchByName = () =>
			source.filter((account) => {
				let fullname = `${account.firstname} ${account.middlename} ${account.lastname}`.toLowerCase();
				return fullname.search(name.trim().toLowerCase()) !== -1;
			});

		let result;
		if (email && email.trim() !== '') {
			result = searchByEmail();
		} else if (phoneNumber && phoneNumber.trim() !== '') {
			result = searchByPhoneNumber();
		} else if (name && name.trim() !== '') {
			result = searchByName();
		} else {
			result = source;
		}
		return await dispatch({
			type: SEARCH_ACCOUNTS_SUCCESS,
			payload: result
		});
	} catch (error) {
		console.log(error);
		return await dispatch({
			type: SEARCH_ACCOUNTS_FAILLURE
		});
	}
};

export const resetLogsSearch = () => async (dispatch) => {
	return await dispatch({
		type: RESET_LOGS_SEARCH
	});
};

export const resetAccountSearch = () => async (dispatch) => {
	return await dispatch({
		type: RESET_ACCOUNT_SEARCH
	});
};

export const resetAdmin = () => async (dispatch) => {
	return await dispatch({
		type: RESET_ACCOUNT_MANAGEMENT
	});
};
