import axios from 'axios';

import {
	HANDLE_NO_TOKEN,
	FETCHING_ADMINBOARD,
	FETCH_ADMINBOARD_SUCCESS,
	FETCH_ADMINBOARD_FAILLURE
} from './actionTypes';

const {
	API_BASE_ROOT
} = require('../../config/api');

const ADMIN_BASE_URL = `${API_BASE_ROOT}/v1/admin`;

const URLs = {
	adminBoard: ADMIN_BASE_URL + `/adminBoard`
};

export const fetchAdminBoard = () => async (dispatch) => {
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
			type: FETCHING_ADMINBOARD
		});

		const res = await axios.get(URLs.adminBoard, {
			headers: {
				Authorization: `Bearer ${candidateToken}`
			}
		});

		if (res.status === 200 && res.data.success) {
			return await dispatch({
				type: FETCH_ADMINBOARD_SUCCESS,
				payload: res.data.content
			});
		}
		return await dispatch({
			type: FETCH_ADMINBOARD_FAILLURE,
			payload: res.data.message
		});
	} catch (error) {
		console.log(error.response);
		if (error.response.status === 500) {
			localStorage.clear();
			sessionStorage.clear();
		}
		return await dispatch({
			type: FETCH_ADMINBOARD_FAILLURE,
			payload: error.response.data.message
		});
	}
};