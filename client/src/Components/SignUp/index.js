import "./SignUp.css";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import LoadingSpinner from "../LoadingSpinner";
import { handleSignUp } from "../../store/actions/signup";
import { resetSignup } from "../../store/actions/signup";
import SignUpForm from "./SignUpForm";
import SignupConfirmation from "./SignupConfirmation";
import Wrapper from "../PageWrapper";

class SignUp extends Component {
  constructor(props) {
    super(props);
    props.resetSignup();
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(data) {
    if (this.validateData(data)) {
      return this.props.handleSignUp(data);
    }
    return;
  }

  renderSignUp() {
    const {
      user,
      signupLoading,
      userLoading,
      signupSuccess,
      message
    } = this.props;
    const isLoading = signupLoading || userLoading;
    if (user && !signupLoading && !userLoading) {
      return <Redirect to="/dashboard" />;
    }
    if (!user && signupSuccess && !signupLoading && !userLoading) {
      return <SignupConfirmation message={message} />;
    }
    if (!user && !signupSuccess && !signupLoading && !userLoading) {
      return <SignUpForm signupHandler={this.handleSubmit} />;
    }
    return <LoadingSpinner isLoading={isLoading} />;
  }

  render() {
    return <Wrapper>{this.renderSignUp()}</Wrapper>;
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    message: state.signup.message,
    signupSuccess: state.signup.isCompleted,
    signupLoading: state.signup.isLoading,
    userLoading: state.auth.isLoading
  };
};

export default connect(
  mapStateToProps,
  { resetSignup, handleSignUp }
)(SignUp);
