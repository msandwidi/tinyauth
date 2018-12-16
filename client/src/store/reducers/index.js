import { combineReducers } from "redux";
import authReducer from "./authReducer";
import adminBoardReducer from "./adminBoardReducer";
import dashboardReducer from "./dashboardReducer";
import recoveryReducer from "./recoveryReducer";
import signupReducer from "./signupReducer";
import activationReducer from "./activationReducer";
import updateMyProfileReducer from "./updateMyProfileReducer";
import newAccountReducer from "./newAccountReducer";
import updateUserAccountReducer from "./updateUserAccountReducer";
import accountsManagementReducer from "./accountsManagementReducer";

export default combineReducers({
  auth: authReducer,
  newAccount: newAccountReducer,
  accountRecovery: recoveryReducer,
  dashboard: dashboardReducer,
  adminBoard: adminBoardReducer,
  signup: signupReducer,
  accountsManagement: accountsManagementReducer,
  accountActivation: activationReducer,
  myProfileUpdate: updateMyProfileReducer,
  userAccountUpdate: updateUserAccountReducer
});
