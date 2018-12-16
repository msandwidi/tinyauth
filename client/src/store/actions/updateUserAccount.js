import axios from 'axios';

import {
	HANDLE_NO_TOKEN,
	SET_SELECTED_USER,
	ACTIVATING_ACCOUNT,
	ACTIVATE_ACCOUNT_SUCCESS,
	ACTIVATE_ACCOUNT_FAILLURE,
	RESETTING_PASSWORD,
	RESET_PASSWORD_SUCCESS,
	RESET_PASSWORD_FAILLURE,
	CLOSING_ACCOUNT,
	CLOSE_ACCOUNT_SUCCESS,
	CLOSE_ACCOUNT_FAILLURE,
	REOPENING_ACCOUNT,
	REOPEN_ACCOUNT_SUCCESS,
	REOPEN_ACCOUNT_FAILLURE,
	RESET_ACCOUNT_UPDATE,
	UPDATE_ACCOUNTLIST_SUCCESS,
	SETTING_AS_ADMIN,
	SET_AS_ADMIN_SUCCESS,
	SET_AS_ADMIN_FAILLURE,
	REVOKING_ADMIN,
	REVOKE_ADMIN_SUCCESS,
	REVOKE_ADMIN_FAILLURE,
	FETCHING_ACCOUNT_LOGS,
	FETCH_ACCOUNT_LOGS_SUCCESS,
  FETCH_ACCOUNT_LOGS_FAILLURE,
  PROCESSING_ACCOUNT_ACTION,
  ACCOUNT_ACTION_SUCCESS,
  ACCOUNT_ACTION_FAILLURE
} from './actionTypes';

const { API_BASE_ROOT } = require('../../config/api');

const ADMIN_BASE_URL = `${API_BASE_ROOT}/v1/admin`;

const URLs = {
	accountActivity: ADMIN_BASE_URL + `/accounts/account-activity`,
	accountAction: ADMIN_BASE_URL + `/accounts/account-action`
};

export const processAccountAction = (accountId, action) => async (dispatch) => {
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
			type: PROCESSING_ACCOUNT_ACTION
		});

		const res = await axios.post(
			URLs.accountAction,
			{ accountId, action },
			{
				headers: {
					Authorization: `Bearer ${candidateToken}`
				}
			}
		);

		if (res.status === 200 && res.data.success) {
			await dispatch({
				type: ACCOUNT_ACTION_SUCCESS,
				payload: res.data.message
			});
			return await dispatch({
				type: UPDATE_ACCOUNTLIST_SUCCESS,
				payload: res.data.accounts
			});
		}
		return await dispatch({
			type: ACCOUNT_ACTION_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		return await dispatch({
			type: ACCOUNT_ACTION_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const activateAccount = (id) => async (dispatch) => {
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
			type: ACTIVATING_ACCOUNT
		});

		const res = await axios.post(
			URLs.activateAccount,
			{ id },
			{
				headers: {
					Authorization: `Bearer ${candidateToken}`
				}
			}
		);

		if (res.status === 200 && res.data.success) {
			await dispatch({
				type: ACTIVATE_ACCOUNT_SUCCESS,
				payload: res.data.message
			});
			return await dispatch({
				type: UPDATE_ACCOUNTLIST_SUCCESS,
				payload: res.data.accounts
			});
		}
		return await dispatch({
			type: ACTIVATE_ACCOUNT_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		return await dispatch({
			type: ACTIVATE_ACCOUNT_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const resetPassword = (id) => async (dispatch) => {
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
			type: RESETTING_PASSWORD
		});

		const res = await axios.post(
			URLs.resetPassword,
			{ id },
			{
				headers: {
					Authorization: `Bearer ${candidateToken}`
				}
			}
		);

		if (res.status === 200 && res.data.success) {
			await dispatch({
				type: RESET_PASSWORD_SUCCESS,
				payload: res.data.message
			});
			return await dispatch({
				type: UPDATE_ACCOUNTLIST_SUCCESS,
				payload: res.data.accounts
			});
		}
		return await dispatch({
			type: RESET_PASSWORD_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		return await dispatch({
			type: RESET_PASSWORD_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const closeAccount = (id) => async (dispatch) => {
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
			type: CLOSING_ACCOUNT
		});

		const res = await axios.post(
			URLs.closeAccount,
			{ id },
			{
				headers: {
					Authorization: `Bearer ${candidateToken}`
				}
			}
		);

		console.log(res.data);

		if (res.status === 200 && res.data.success) {
			await dispatch({
				type: CLOSE_ACCOUNT_SUCCESS,
				payload: res.data.message
			});
			return await dispatch({
				type: UPDATE_ACCOUNTLIST_SUCCESS,
				payload: res.data.accounts
			});
		}
		return await dispatch({
			type: CLOSE_ACCOUNT_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		return await dispatch({
			type: CLOSE_ACCOUNT_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const reopenAccount = (id) => async (dispatch) => {
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
			type: REOPENING_ACCOUNT
		});

		const res = await axios.post(
			URLs.reopenAccount,
			{ id },
			{
				headers: {
					Authorization: `Bearer ${candidateToken}`
				}
			}
		);

		if (res.status === 200 && res.data.success) {
			await dispatch({
				type: REOPEN_ACCOUNT_SUCCESS,
				payload: res.data.message
			});
			return await dispatch({
				type: UPDATE_ACCOUNTLIST_SUCCESS,
				payload: res.data.accounts
			});
		}
		return await dispatch({
			type: REOPEN_ACCOUNT_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		return await dispatch({
			type: REOPEN_ACCOUNT_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const setSelectedUser = (user) => async (dispatch) => {
	return await dispatch({
		type: SET_SELECTED_USER,
		payload: user
	});
};

export const resetAccountUpdate = () => async (dispatch) => {
	return await dispatch({
		type: RESET_ACCOUNT_UPDATE
	});
};

export const setAsAdmin = (id) => async (dispatch) => {
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
			type: SETTING_AS_ADMIN
		});

		const res = await axios.post(
			URLs.setToAdmin,
			{ id },
			{
				headers: {
					Authorization: `Bearer ${candidateToken}`
				}
			}
		);

		if (res.status === 200 && res.data.success) {
			await dispatch({
				type: SET_AS_ADMIN_SUCCESS,
				payload: res.data.message
			});
			return await dispatch({
				type: UPDATE_ACCOUNTLIST_SUCCESS,
				payload: res.data.accounts
			});
		}
		return await dispatch({
			type: SET_AS_ADMIN_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		return await dispatch({
			type: SET_AS_ADMIN_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const revokeAdmin = (id) => async (dispatch) => {
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
			type: REVOKING_ADMIN
		});

		const res = await axios.post(
			URLs.revokeAdmin,
			{ id },
			{
				headers: {
					Authorization: `Bearer ${candidateToken}`
				}
			}
		);

		if (res.status === 200 && res.data.success) {
			await dispatch({
				type: REVOKE_ADMIN_SUCCESS,
				payload: res.data.message
			});
			return await dispatch({
				type: UPDATE_ACCOUNTLIST_SUCCESS,
				payload: res.data.accounts
			});
		}
		return await dispatch({
			type: REVOKE_ADMIN_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		return await dispatch({
			type: REVOKE_ADMIN_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const viewAccountLogs = (id) => async (dispatch) => {
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
			type: FETCHING_ACCOUNT_LOGS
		});

		const res = await axios.get(URLs.accountActivity + '/' + id, {
			headers: {
				Authorization: `Bearer ${candidateToken}`
			}
		});

		if (res.status === 200 && res.data.success) {
			return await dispatch({
				type: FETCH_ACCOUNT_LOGS_SUCCESS,
				payload: res.data.logs
			});
		}
		return await dispatch({
			type: FETCH_ACCOUNT_LOGS_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		return await dispatch({
			type: FETCH_ACCOUNT_LOGS_FAILLURE,
			payload: error.response.data.message
		});
	}
};
