import axios from 'axios';

import {
	CHECK_AVAILABILITY_FAILLURE,
	CHECK_AVAILABILITY_SUCCESS,
	CHECKING_ACCOUNT_AVAILABILITY,
	HANDLE_NO_TOKEN,
	CREATE_NEW_ACCOUNT_SUCCESS,
	FETCH_ACCOUNTS_MANAGEMENT_SUCCESS,
	CREATE_NEW_ACCOUNT_FAILLURE,
	CREATING_NEW_ACCOUNT,
	RESET_ACCOUNT_CREATION
} from './actionTypes';

const { API_BASE_ROOT } = require('../../config/api');

const ADMIN_BASE_URL = `${API_BASE_ROOT}/v1/admin`;

const URLs = {
	checkAvailability: ADMIN_BASE_URL + `/accounts/check-availability`,
	createNewAccount: ADMIN_BASE_URL + `/accounts/create-account`
};

export const checkAvailability = (email) => async (dispatch) => {
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
			type: CHECKING_ACCOUNT_AVAILABILITY
		});

		const res = await axios.post(URLs.checkAvailability, email, {
			headers: {
				Authorization: `Bearer ${candidateToken}`
			}
		});

		if (res.status === 200 && res.data.success) {
			return await dispatch({
				type: CHECK_AVAILABILITY_SUCCESS,
				payload: res.data.isAvailable
			});
		}
		return await dispatch({
			type: CHECK_AVAILABILITY_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		if (error.response.status === 500) {
			localStorage.clear();
			sessionStorage.clear();
		}
		return await dispatch({
			type: CHECK_AVAILABILITY_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const createNewAccount = (data) => async (dispatch) => {
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
			type: CREATING_NEW_ACCOUNT
		});

		const res = await axios.post(URLs.createNewAccount, data, {
			headers: {
				Authorization: `Bearer ${candidateToken}`
			}
		});

		if (res.status === 200 && res.data.success) {
			await dispatch({
				type: FETCH_ACCOUNTS_MANAGEMENT_SUCCESS,
				payload: res.data.accounts
			});

			return await dispatch({
				type: CREATE_NEW_ACCOUNT_SUCCESS,
				payload: res.data.message
			});
		}
		return await dispatch({
			type: CREATE_NEW_ACCOUNT_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		return await dispatch({
			type: CREATE_NEW_ACCOUNT_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const resetAccountCreation = () => async (dispatch) => {
	return await dispatch({
		type: RESET_ACCOUNT_CREATION
	});
};
