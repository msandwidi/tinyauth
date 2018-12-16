import axios from 'axios';

import {
	HANDLE_NO_TOKEN,
	UPDATE_USER_SUCCESS,
	UPDATE_USER_FAILLURE,
	UPDATING_PASSWORD,
	UPDATE_PASSWORD_FAILLURE,
	UPDATE_PASSWORD_SUCCESS,
	UPDATING_USER,
	GLOBAL_RESET,
	RESET_UPDATE
} from './actionTypes';

const {
	API_BASE_ROOT
} = require('../../config/api');

const ADMIN_BASE_URL = `${API_BASE_ROOT}/v1/admin`;

const URLs = {
	updateProfile: ADMIN_BASE_URL + `/my/update-profile`,
	changePassword: ADMIN_BASE_URL + '/my/change-password'
};

export const resetUpdate = () => async (dispatch) => {
	return dispatch({
		type: RESET_UPDATE
	});
};

export const handleProfileUpdate = (userData) => async (dispatch) => {
	try {
		const candidateToken = localStorage.getItem('authToken');
		if (!candidateToken || candidateToken === '') {
			localStorage.clear();
			sessionStorage.clear();
			await dispatch({
				type: GLOBAL_RESET
			});
			return await dispatch({
				type: HANDLE_NO_TOKEN,
				payload: 'No Token Provided'
			});
		}

		dispatch({
			type: UPDATING_USER
		});

		const res = await axios.post(
			URLs.updateProfile, { ...userData
			}, {
				headers: {
					Authorization: `Bearer ${candidateToken}`
				}
			}
		);

		if (res.status === 200 && res.data.success) {
			return await dispatch({
				type: UPDATE_USER_SUCCESS,
				payload: res.data
			});
		}
		return await dispatch({
			type: UPDATE_USER_FAILLURE,
			payload: res.data
		});
	} catch (error) {
		console.log(error.response);
		return await dispatch({
			type: UPDATE_USER_FAILLURE,
			payload: error.response.data
		});
	}
};

export const handlePasswordChange = (userData) => async (dispatch) => {
	try {
		const candidateToken = localStorage.getItem('authToken');
		if (!candidateToken || candidateToken === '') {
			localStorage.clear();
			sessionStorage.clear();
			await dispatch({
				type: GLOBAL_RESET
			});
			return await dispatch({
				type: HANDLE_NO_TOKEN,
				payload: 'No Token Provided'
			});
		}

		dispatch({
			type: UPDATING_PASSWORD
		});

		const res = await axios.post(
			URLs.changePassword,
			userData, {
				headers: {
					Authorization: `Bearer ${candidateToken}`
				}
			}
		);

		if (res.status === 200 && res.data.success) {
			localStorage.clear();
			sessionStorage.clear();
			await dispatch({
				type: GLOBAL_RESET
			});
			return await dispatch({
				type: UPDATE_PASSWORD_SUCCESS,
				payload: res.data
			});
		}
		return await dispatch({
			type: UPDATE_PASSWORD_FAILLURE,
			payload: res.data
		});
	} catch (error) {
		console.log(error.response);
		if (error.response.status === 500) {
			await dispatch({
				type: GLOBAL_RESET
			});
		}
		return await dispatch({
			type: UPDATE_PASSWORD_FAILLURE,
			payload: error.response.data
		});
	}
};