import React, { Component } from "react";
import Button from "../Elements/Button";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import LoadingSpinner from "../LoadingSpinner";
import ConfirmationPage from "./ConfirmationPage";
import {
  processAccountAction,
} from "../../store/actions/updateUserAccount";

class AccountDetails extends Component {
  renderOptions() {
    const { selectedUser, user } = this.props;

    if (selectedUser.isClosed) {
      return (
        <React.Fragment>
          <NavLink
            className="dropdown-item"
            to="#"
            onClick={() => this.props.processAccountAction(selectedUser._id, 'reopen')}
          >
            Reopen Account
          </NavLink>
          <NavLink className="dropdown-item" to="/account-activity">
            View Logs
          </NavLink>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <NavLink className="dropdown-item" to="#">
          Update Info
        </NavLink>
        {selectedUser.isVerified ? (
          <NavLink
            className="dropdown-item"
            to="#"
            onClick={() => this.props.processAccountAction(selectedUser._id, 'resetPassword')}
          >
            Reset Password
          </NavLink>
        ) : (
          <NavLink
            className="dropdown-item"
            to="#"
            onClick={() => this.props.processAccountAction(selectedUser._id, 'activate')}
          >
            Activate Account
          </NavLink>
        )}

        {!selectedUser.isAdmin && user.isSuperAdmin ? (
          <NavLink
            className="dropdown-item"
            to="#"
            onClick={() => this.props.processAccountAction(selectedUser._id, 'setToAdmin')}
          >
            Set as Admin
          </NavLink>
        ) : null}
        {selectedUser.isAdmin && user.isSuperAdmin ? (
          <NavLink
            className="dropdown-item"
            to="#"
            onClick={() => this.props.processAccountAction(selectedUser._id, 'revokeAdmin')}
          >
            Revoke Admin
          </NavLink>
        ) : null}

        <NavLink
          className="dropdown-item"
          to="#"
          onClick={() => this.props.processAccountAction(selectedUser._id, 'close')}
        >
          Close Account
        </NavLink>
        <div className="line" />
        <NavLink className="dropdown-item" to="/account-activity">
          View Logs
        </NavLink>
      </React.Fragment>
    );
  }

  render() {
    const { selectedUser, isLoading, isCompleted, message } = this.props;
    if (isCompleted && !isLoading) {
      return <ConfirmationPage message={message} />;
    }
    if (selectedUser && !isCompleted && !isLoading) {
      return (
        <React.Fragment>
          <div className="row">
            <div className="col-sm-9">
              <ul className="list-group list-group-flush">
                <li className="list-group-item pl-0">
                  <b>Name: </b> {selectedUser.firstname} {selectedUser.lastname}
                </li>
                <li className="list-group-item pl-0">
                  <b>Email Address: </b>
                  {selectedUser.email}
                </li>
                <li className="list-group-item pl-0">
                  <b>Phone #: </b>
                  {selectedUser.phoneNumber}
                </li>
              </ul>

              <div className="btn-group">
                <Button
                  value="More Options"
                  className="btn btn-default dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                />
                <div className="dropdown-menu">{this.renderOptions()}</div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }
    return <LoadingSpinner isLoading={isLoading} />;
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    selectedUser: state.userAccountUpdate.selectedUser,
    isLoading: state.userAccountUpdate.isLoading,
    isCompleted: state.userAccountUpdate.isCompleted,
    message: state.userAccountUpdate.message
  };
};

export default connect(
  mapStateToProps,
  {
    processAccountAction
  }
)(AccountDetails);
