import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { handleLogout } from "../../store/actions/auth";

class RighNav extends Component {
  renderContentRight() {
    const { user, isLoading, handleLogout } = this.props;
    if (user) {
      return (
        <ul className="navbar-nav ml-auto mr-5">
          <li className="nav-item">
            <div className="dropdown show">
              <NavLink
                to="#!"
                className="nav-link dropdown-toggle"
                role="button"
                id="dropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Management
              </NavLink>

              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <NavLink className="dropdown-item" to="/accounts-management">
                  Accounts
                </NavLink>
                <div className="dropdown-divider" />
                <NavLink
                  className="dropdown-item"
                  to="#!"
                >
                  Settings
                </NavLink>
              </div>
            </div>
          </li>
       
          <li className="nav-item">
            <div className="dropdown show">
              <NavLink
                to="#!"
                className="nav-link dropdown-toggle"
                role="button"
                id="dropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {this.props.user.firstname}
              </NavLink>

              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <NavLink className="dropdown-item" to="/profile">
                  My Profile
                </NavLink>
                <div className="dropdown-divider" />
                <NavLink
                  className="dropdown-item"
                  to="#!"
                  onClick={handleLogout}
                >
                  Logout
                </NavLink>
              </div>
            </div>
          </li>
        </ul>
      );
    }
    if (!user && isLoading) {
      return null;
    }
    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <NavLink className="nav-link" to="/login">
            Login
          </NavLink>
        </li>
      </ul>
    );
  }

  render() {
    return this.renderContentRight();
  }
}

const mapPropsToState = state => {
  return {
    user: state.auth.user,
    isLoading: state.auth.isLoading
  };
};

export default connect(
  mapPropsToState,
  { handleLogout }
)(RighNav);
