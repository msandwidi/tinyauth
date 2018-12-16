import axios from 'axios';

import {
	HANDLING_RECOVERY,
	HANDLE_RECOVERY_EMAIL_SUCCESS,
	HANDLE_RECOVERY_EMAIL_FAILLURE,
	HANDLING_RESET_CODE,
	HANDLE_RESET_CODE_SUCCESS,
	HANDLE_RESET_CODE_FAILLURE,
	HANDLING_NEW_PASSWORD,
	HANDLE_NEW_PASSWORD_SUCCESS,
	HANDLE_NEW_PASSWORD_FAILLURE,
	HANDLE_NO_RESET_TOKEN,
	RESET_RECOVERY,
	GLOBAL_RESET
} from './actionTypes';

const { API_BASE_ROOT } = require('../../config/api');

const ADMIN_BASE_URL = `${API_BASE_ROOT}/v1/admin`;

const URLs = {
	recovery: ADMIN_BASE_URL + `/my/recovery`,
	verifyCode: ADMIN_BASE_URL + `/my/verify-code`,
	resetPwd: ADMIN_BASE_URL + `/my/reset-account`
};

export const resetRecovery = () => async (dispatch) => {
	localStorage.clear();
	sessionStorage.clear();
	await dispatch({
		type: RESET_RECOVERY
	});
};

export const handleRecovery = (userData) => async (dispatch) => {
	try {
		await dispatch({
			type: HANDLING_RECOVERY
		});
		const res = await axios.post(URLs.recovery, userData);

		if (res.status === 200 && res.data.success) {
			sessionStorage.setItem('resetToken', res.data.token);
			return await dispatch({
				type: HANDLE_RECOVERY_EMAIL_SUCCESS,
				payload: res.data.message
			});
		}
		return await dispatch({
			type: HANDLE_RECOVERY_EMAIL_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log('\n\n', error.response, '\n\n');
		if (error.response && error.response.status === 500) {
			await dispatch({
				type: GLOBAL_RESET
			});
		}
		return await dispatch({
			type: HANDLE_RECOVERY_EMAIL_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const handleCode = (resetcode) => async (dispatch) => {
	try {
		const resetToken = sessionStorage.getItem('resetToken');

		if (!resetToken || resetToken === '') {
			localStorage.clear();
			sessionStorage.clear();
			return await dispatch({
				type: HANDLE_NO_RESET_TOKEN,
				payload: 'No Token Provided'
			});
		}
		dispatch({
			type: HANDLING_RESET_CODE
		});
		const res = await axios.post(URLs.verifyCode, resetcode, {
			headers: {
				Authorization: `Bearer ${resetToken}`
			}
		});
		if (res.status === 200 && res.data.success) {
			sessionStorage.setItem('newPwdToken', res.data.token);
			return await dispatch({
				type: HANDLE_RESET_CODE_SUCCESS
			});
		}
		return await dispatch({
			type: HANDLE_RESET_CODE_FAILLURE,
			payload: 'Recovery Failled'
		});
	} catch (error) {
		console.log('\n\n', error.response, '\n\n');
		if (error.response && error.response.status === 500) {
			await dispatch({
				type: GLOBAL_RESET
			});
		}
		return await dispatch({
			type: HANDLE_RESET_CODE_FAILLURE,
			payload: 'Recovery Failled with unknown error'
		});
	}
};

export const handleNewPassword = (newData) => async (dispatch) => {
	try {
		const resetToken = sessionStorage.getItem('newPwdToken');

		if (!resetToken || resetToken === '') {
			localStorage.clear();
			sessionStorage.clear();
			return await dispatch({
				type: HANDLE_NO_RESET_TOKEN,
				payload: 'No Token Provided'
			});
		}

		dispatch({
			type: HANDLING_NEW_PASSWORD
		});
		const res = await axios.post(URLs.resetPwd, newData, {
			headers: {
				Authorization: `Bearer ${resetToken}`
			}
		});
		if (res.status === 200 && res.data.success) {
			localStorage.clear();
			sessionStorage.clear();
			return await dispatch({
				type: HANDLE_NEW_PASSWORD_SUCCESS
			});
		}
		return await dispatch({
			type: HANDLE_NEW_PASSWORD_FAILLURE,
			payload: 'Recovery Failled'
		});
	} catch (error) {
		console.log('\n\n', error.response, '\n\n');
		if (error.response && error.response.status === 500) {
			await dispatch({
				type: GLOBAL_RESET
			});
		}
		return await dispatch({
			type: HANDLE_NEW_PASSWORD_FAILLURE,
			payload: 'Recovery Failled with unknown error'
		});
	}
};
