import axios from "axios";

import {
  FETCHING_PROFILE,
  HANDLE_NO_TOKEN,
  FETCH_PROFILE_FAILLURE,
  FETCH_PROFILE_SUCCESS,
  GLOBAL_RESET,
} from "./actionTypes";

const { API_BASE_ROOT } = require('../../config/api');

const ADMIN_BASE_URL = `${API_BASE_ROOT}/v1/admin`;

const URLs = {
	profile: ADMIN_BASE_URL + `/my/profile`,
};


export const fetchProfile = () => async dispatch => {
  try {
    const candidateToken = localStorage.getItem("authToken");
    if (!candidateToken || candidateToken === "") {
      localStorage.clear();
      sessionStorage.clear();
      await dispatch({
        type: GLOBAL_RESET
      });
      return await dispatch({
        type: HANDLE_NO_TOKEN,
        payload: "No Token Provided"
      });
    }

    dispatch({
      type: FETCHING_PROFILE
    });
    const res = await axios.get(URLs.profile, {
      headers: {
        Authorization: `Bearer ${candidateToken}`
      }
    });

    if (res.status === 200 && res.data.success) {
      return await dispatch({
        type: FETCH_PROFILE_SUCCESS,
        payload: res.data
      });
    }
    return await dispatch({
      type: FETCH_PROFILE_FAILLURE,
      payload: "invalid token"
    });
  } catch (error) {
    console.log(error.response);
    if (error.response.status === 500) {
      await dispatch({
        type: GLOBAL_RESET
      });
    }
    return await dispatch({
      type: FETCH_PROFILE_FAILLURE,
      payload: "Fetching profile failled with unknown error"
    });
  }
};
