import { GLOBAL_RESET } from "./actionTypes";

export const globalReset = () => async dispatch => {
  localStorage.clear();
  sessionStorage.clear();
  await dispatch({
    type: GLOBAL_RESET
  });
};
