import axios from 'axios';

import {
	HANDLING_ACTIVATION,
	HANDLE_ACTIVATION_EMAIL_SUCCESS,
	HANDLE_ACTIVATION_EMAIL_FAILLURE,
	HANDLE_ACTIVATION_CODE_SUCCESS,
	HANDLE_ACTIVATION_CODE_FAILLURE,
	HANDLING_STATUS_CHECK,
	GLOBAL_RESET,
	RESET_ACTIVATION
} from './actionTypes';

const { API_BASE_ROOT } = require('../../config/api');

const ADMIN_BASE_URL = `${API_BASE_ROOT}/v1/admin`;

const URLs = {
	checkStatus: ADMIN_BASE_URL + `/my/check-status`,
	accountActivation: ADMIN_BASE_URL + `/my/activate-account`
};

export const resetAccountActivation = () => async (dispatch) => {
	localStorage.clear();
	sessionStorage.clear();
	await dispatch({
		type: RESET_ACTIVATION
	});
};

export const handleStatusCheck = (username) => async (dispatch) => {
	try {
		dispatch({
			type: HANDLING_STATUS_CHECK
		});
		const res = await axios.post(URLs.checkStatus, username);

		if (res.status === 200) {
			sessionStorage.setItem('activationToken', res.data.token);
			return await dispatch({
				type: HANDLE_ACTIVATION_EMAIL_SUCCESS,
				payload: res.data.message
			});
		}

		return await dispatch({
			type: HANDLE_ACTIVATION_EMAIL_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		if (error.response && error.response.status === 500) {
			await dispatch({
				type: GLOBAL_RESET
			});
		}
		localStorage.clear();
		sessionStorage.clear();
		return await dispatch({
			type: HANDLE_ACTIVATION_EMAIL_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const handleAccountActivation = (code) => async (dispatch) => {
	try {
		const activationToken = sessionStorage.getItem('activationToken');

		dispatch({
			type: HANDLING_ACTIVATION
		});

		const res = await axios.post(URLs.accountActivation, code, {
			headers: {
				Authorization: `Bearer ${activationToken}`
			}
		});

		if (res.status === 200) {
			return await dispatch({
				type: HANDLE_ACTIVATION_CODE_SUCCESS,
				payload: res.data.message
			});
		}
		localStorage.clear();
		sessionStorage.clear();

		return await dispatch({
			type: HANDLE_ACTIVATION_CODE_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		if (error.response && error.response.status === 500) {
			await dispatch({
				type: GLOBAL_RESET
			});
		}
		localStorage.clear();
		sessionStorage.clear();
		return await dispatch({
			type: HANDLE_ACTIVATION_CODE_FAILLURE,
			payload: error.response.data.message
		});
	}
};
