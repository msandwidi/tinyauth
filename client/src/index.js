import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./Components/App";
import { configureStore } from "./store/store";
import { fetchUser } from "./store/actions/auth";

const store = configureStore();

store.dispatch(fetchUser());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept("./store/reducers", () => {
    const nextRootReducer = require("./store/reducers");
    store.replaceReducer(nextRootReducer);
  });
}
