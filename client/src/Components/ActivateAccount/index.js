import "./ActivateAccount.css";
import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import LoadingSpinner from "../LoadingSpinner";
import {
  handleStatusCheck,
  handleAccountActivation,
  resetAccountActivation
} from "../../store/actions/accountActivation";
import CredentialsForm from "./CredentialsForm";
import ConfirmationPage from "./ConfirmationPage";
import ActivationCodeForm from "./ActivationCodeForm";
import Wrapper from "../PageWrapper";


class AccountActivation extends Component {
  constructor(props) {
    super(props);
    props.resetAccountActivation();
    this.handleStatusCheck = this.handleStatusCheck.bind(this);
    this.handleAccountActivation = this.handleAccountActivation.bind(this);
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

  handleStatusCheck(data) {
    if (this.validateData(data)) {
      return this.props.handleStatusCheck(data);
    }
    return;
  }
  handleAccountActivation(data) {
    if (this.validateData(data)) {
      return this.props.handleAccountActivation( data);
    }
    return;
  }

  renderAccountActivation() {
    const {
      user,
      activationLoading,
      userLoading,
      statusCheckSuccess,
      codeCheckSuccess,
      message
    } = this.props;
    const isLoading = activationLoading || userLoading;
    if (user && !activationLoading && !userLoading) {
      return <Redirect to="/dashboard" />;
    }
    if (
      !user &&
      statusCheckSuccess &&
      !codeCheckSuccess &&
      !activationLoading &&
      !userLoading
    ) {
      return (
        <ActivationCodeForm
          activateAccountHandler={this.handleAccountActivation}
        />
      );
    }
    if (
      !user &&
      !statusCheckSuccess &&
      !codeCheckSuccess &&
      !activationLoading &&
      !userLoading
    ) {
      return <CredentialsForm checkAccountHandler={this.handleStatusCheck} />;
    }
    if (
      !user &&
      statusCheckSuccess &&
      codeCheckSuccess &&
      !activationLoading &&
      !userLoading
    ) {
      return <ConfirmationPage message={message} />;
    }
    return <LoadingSpinner isLoading={isLoading} />;
  }

  render() {
    return <Wrapper>{this.renderAccountActivation()}</Wrapper>;
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    message: state.accountActivation.message,
    statusCheckSuccess: state.accountActivation.isAccountVerified,
    codeCheckSuccess: state.accountActivation.isCodeVerified,
    activationLoading: state.accountActivation.isLoading,
    userLoading: state.auth.isLoading
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      handleStatusCheck,
      handleAccountActivation,
      resetAccountActivation
    }
  )(AccountActivation)
);
