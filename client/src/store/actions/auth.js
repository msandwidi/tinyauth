import axios from 'axios';

import {
	FETCHING_USER,
	HANDLING_LOGIN,
	HANDLE_LOGIN_SUCCESS,
	HANDLE_LOGIN_FAILLURE,
	HANDLE_NO_TOKEN,
	FETCH_USER_FAILLURE,
	FETCH_USER_SUCCESS,
	HANDLE_LOGOUT_SUCCESS,
	HANDLING_LOGOUT,
	HANDLE_LOGOUT_FAILLURE,
	GLOBAL_RESET
} from './actionTypes';

const { API_BASE_ROOT } = require('../../config/api');

const ADMIN_BASE_URL = `${API_BASE_ROOT}/v1/admin`;

const URLs = {
	signin: ADMIN_BASE_URL + `/my/signin`,
	logout: ADMIN_BASE_URL + `/my/logout`,
	fetchUser: ADMIN_BASE_URL + `/my/auth`,
	formToken: ADMIN_BASE_URL + `/form-auth`
};

export const fetchUser = () => async (dispatch) => {
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
			type: FETCHING_USER
		});

		const res = await axios.get(URLs.fetchUser, {
			headers: {
				Authorization: `Bearer ${candidateToken}`
			}
		});

		if (res.status === 200 && res.data.success) {
			localStorage.setItem('authToken', res.data.token);
			return await dispatch({
				type: FETCH_USER_SUCCESS,
				payload: res.data.user
			});
		}
		localStorage.clear();
		sessionStorage.clear();
		return await dispatch({
			type: FETCH_USER_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		localStorage.clear();
		sessionStorage.clear();
		await dispatch({
			type: GLOBAL_RESET
		});
		return await dispatch({
			type: FETCH_USER_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const handleLogout = () => async (dispatch) => {
	try {
		const candidateToken = localStorage.getItem('authToken');
		if (!candidateToken || candidateToken === '') {
			localStorage.clear();
			sessionStorage.clear();
			return await dispatch({
				type: HANDLE_NO_TOKEN,
				payload: 'No Token Provided'
			});
		}
		dispatch({
			type: HANDLING_LOGOUT
		});
		const res = await axios.post(
			URLs.logout,
			{},
			{
				headers: {
					Authorization: `Bearer ${candidateToken}`
				}
			}
		);
		if (res.status === 200 && res.data.success) {
			localStorage.clear();
			sessionStorage.clear();
			await dispatch({
				type: HANDLE_LOGOUT_SUCCESS,
				payload: res.data.message
			});
			return await dispatch({
				type: GLOBAL_RESET
			});
		}
		localStorage.clear();
		sessionStorage.clear();
		await dispatch({
			type: GLOBAL_RESET
		});
		return await dispatch({
			type: HANDLE_LOGOUT_SUCCESS,
			payload: 'You logged out successfully'
		});
	} catch (error) {
		console.log(error);
		localStorage.clear();
		sessionStorage.clear();
		await dispatch({
			type: GLOBAL_RESET
		});
		return await dispatch({
			type: HANDLE_LOGOUT_FAILLURE,
			payload: 'Logged out with unknown error'
		});
	}
};

export const handleLogin = ({ username, password }) => async (dispatch) => {
	dispatch({
		type: HANDLING_LOGIN
	});
	try {
		const formToken = localStorage.getItem('formToken');
		const res = await axios.post(URLs.signin, {
			username,
			password,
			formToken
		});

		if (res.status === 200 && res.data.success) {
			localStorage.setItem('authToken', res.data.token);
			return await dispatch({
				type: HANDLE_LOGIN_SUCCESS,
				payload: res.data.user
			});
		}

		localStorage.clear();
		sessionStorage.clear();
		return await dispatch({
			type: HANDLE_LOGIN_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		localStorage.clear();
		sessionStorage.clear();
		if (error.response.status === 500) {
			return await dispatch({
				type: GLOBAL_RESET
			});
		}
		return await dispatch({
			type: HANDLE_LOGIN_FAILLURE,
			payload: error.response.data.message
		});
	}
};

export const setFormToken = () => async (dispatch) => {
	try {
		const res = await axios.post(URLs.formToken, {});

		if (res.status === 200 && res.data.success) {
			localStorage.setItem('formToken', res.data.token);
			console.log('form token set');
		}
	} catch (error) {
		console.log(error.response);
		if (error.response.status === 500) {
			return await dispatch({
				type: GLOBAL_RESET
			});
		}
		return await dispatch({
			type: HANDLE_LOGIN_FAILLURE,
			payload: error.response.data.message
		});
	}
};
