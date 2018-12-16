import "./AccountRecovery.css";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import AccountRecoveryForm from "./AccountRecoveryForm";
import NewPasswordForm from "./NewPasswordForm";
import RecoveryCodeForm from "./RecoveryCodeForm";
import LoadingSpinner from "../LoadingSpinner";
import ConfirmationPage from "./ConfirmationPage";
import Wrapper from "../PageWrapper";
import {
  handleRecovery,
  handleCode,
  handleNewPassword
} from "../../store/actions/recovery";
import { resetRecovery } from "../../store/actions/recovery";

class AccountRecovery extends Component {
  constructor(props) {
    super(props);
    props.resetRecovery();
    this.handleSubmitRecovery = this.handleSubmitRecovery.bind(this);
    this.handleSubmitCode = this.handleSubmitCode.bind(this);
    this.handleSubmitNewPassword = this.handleSubmitNewPassword.bind(this);
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

  handleSubmitRecovery(data) {
    if (this.validateData(data)) {
      return this.props.handleRecovery(data);
    }
    return;
  }
  handleSubmitNewPassword(data) {
    if (this.validateData(data)) {
      return this.props.handleNewPassword(data);
    }
    return;
  }
  handleSubmitCode(data) {
    if (this.validateData(data)) {
      return this.props.handleCode(data);
    }
    return;
  }

  AccountAccountRecovery() {
    const {
      user,
      message,
      userLoading,
      recoveryLoading,
      emailSuccess,
      codeSuccess,
      passwordSuccess
    } = this.props;
    const isLoading = userLoading || recoveryLoading;
    if (user && !isLoading) {
      return <Redirect to="/dashboard" />;
    }
    if (
      !user &&
      emailSuccess &&
      !codeSuccess &&
      !passwordSuccess &&
      !isLoading
    ) {
      return <RecoveryCodeForm recoveryCodeHandler={this.handleSubmitCode} />;
    }
    if (
      !user &&
      emailSuccess &&
      codeSuccess &&
      !passwordSuccess &&
      !isLoading
    ) {
      return (
        <NewPasswordForm NewPasswordHandler={this.handleSubmitNewPassword} />
      );
    }
    if (!user && emailSuccess && codeSuccess && passwordSuccess && !isLoading) {
      return <ConfirmationPage message={message} />;
    }
    if (
      !user &&
      !emailSuccess &&
      !codeSuccess &&
      !passwordSuccess &&
      !isLoading
    ) {
      return (
        <AccountRecoveryForm recoveryHandler={this.handleSubmitRecovery} />
      );
    }
    return <LoadingSpinner isLoading={isLoading} />;
  }

  render() {
    return <Wrapper>{this.AccountAccountRecovery()}</Wrapper>;
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    emailSuccess: state.accountRecovery.isEmailSent,
    codeSuccess: state.accountRecovery.isCodeVerified,
    passwordSuccess: state.accountRecovery.isPasswordChanged,
    message: state.accountRecovery.message,
    recoveryLoading: state.accountRecovery.isLoading,
    userLoading: state.auth.isLoading
  };
};

export default connect(
  mapStateToProps,
  { resetRecovery, handleRecovery, handleCode, handleNewPassword }
)(AccountRecovery);
