import "./Account.css";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  handlePasswordChange,
  handleProfileUpdate
} from "../../store/actions/updateMyProfile";
import { fetchUser } from "../../store/actions/auth";
import LoadingSpinner from "../LoadingSpinner";
import Wrapper from "../PageWrapper";
import ChangePasswordModal from "./ChangePasswordModal";
import UpdateProfileModal from "./UpdateProfileModal";
import ProfileSection from "./ProfileSection";

class Account extends Component {
  constructor(props) {
    super(props);
    this.submitPasswordChange = this.submitPasswordChange.bind(this);
    this.submitProfileUpdate = this.submitProfileUpdate.bind(this);
    this.props.fetchUser();
  }

  sanitizeData(data) {
    let sanitizedData;

    return sanitizedData;
  }

  validateData(data) {
    let errors = [];
    //validation starts

    //validation ends
    if (errors.length !== 0) {
      return false;
    }
    return true;
  }

  showErrors() {}

  submitProfileUpdate(data) {
    if (this.validateData(data)) {
      return this.props.handleProfileUpdate(data);
    }
    return this.showErrors();
  }

  submitPasswordChange(data) {
    if (this.validateData(data)) {
      return this.props.handlePasswordChange(data);
    }
    return this.showErrors();
  }

  renderContent() {
    const { isLoading, user } = this.props;
    if (!user && !isLoading) {
      return <Redirect to="/login" />;
    }
    if (user) {
      return (
        <div>
          <ProfileSection user={user} />
          <UpdateProfileModal
            updateProfileHandler={this.submitProfileUpdate}
            user={user}
          />
          <ChangePasswordModal
            changePasswordHandler={this.submitPasswordChange}
          />
        </div>
      );
    }
    return <LoadingSpinner isLoading={isLoading} />;
  }

  render() {
    return <Wrapper title="My Account">{this.renderContent()}</Wrapper>;
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    isLoading: state.auth.isLoading
  };
};

export default connect(
  mapStateToProps,
  {
    fetchUser,
    handlePasswordChange,
    handleProfileUpdate
  }
)(Account);
