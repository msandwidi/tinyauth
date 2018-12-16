import axios from 'axios';

import {
	HANDLING_SIGNUP,
	HANDLE_SIGNUP_SUCCESS,
	HANDLE_SIGNUP_FAILLURE,
	GLOBAL_RESET,
	RESET_SIGNUP
} from './actionTypes';

const { API_BASE_ROOT } = require('../../config/api');

const ADMIN_BASE_URL = `${API_BASE_ROOT}/v1/admin`;

const URLs = {
	signUp: ADMIN_BASE_URL + `/my/signup`
};

export const resetSignup = () => async (dispatch) => {
	localStorage.clear();
	sessionStorage.clear();
	await dispatch({
		type: RESET_SIGNUP
	});
};

export const handleSignUp = (userData) => async (dispatch) => {
	try {
		dispatch({
			type: HANDLING_SIGNUP
		});

		const res = await axios.post(URLs.signUp, userData);
		if (res.status === 200) {
			return await dispatch({
				type: HANDLE_SIGNUP_SUCCESS,
				payload: res.data.message
			});
		}
		localStorage.clear();
		sessionStorage.clear();

		return await dispatch({
			type: HANDLE_SIGNUP_FAILLURE,
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
			type: HANDLE_SIGNUP_FAILLURE,
			payload: error.response.data.message
		});
	}
};
