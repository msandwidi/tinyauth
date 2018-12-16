import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import reduxThunk from "redux-thunk";
import logger from "redux-logger";

export function configureStore(initialState={}) {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(reduxThunk, logger)
  );
  return store;
}
