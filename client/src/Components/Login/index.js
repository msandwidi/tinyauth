import "./Login.css";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import LoadingSpinner from "../LoadingSpinner";
import { handleLogin } from "../../store/actions/auth";
import LoginForm from "./LoginForm";
import Wrapper from "../PageWrapper";

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.validateData = this.validateData.bind(this);
  }

  validateData(data) {
    let errors = [];
    if (errors.length !== 0) {
      return false;
    }
    return true;
  }

  handleSubmit(data) {
    if (this.validateData(data)) {
      return this.props.handleLogin(data);
    }
    return console.log(data);
  }

  renderLogin() {
    const { user, isLoading } = this.props;
    if (user && !isLoading) {
      return <Redirect to="/dashboard" />;
    }
    if (!user && !isLoading) {
      return <LoginForm loginHandler={this.handleSubmit} />;
    }
    return <LoadingSpinner isLoading={isLoading} />;
  }

  render() {
    return <Wrapper>{this.renderLogin()}</Wrapper>;
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
  { handleLogin }
)(Login);
