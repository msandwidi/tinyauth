import "./AccountsManagement.css";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import LoadingSpinner from "../LoadingSpinner";
import {
  fetchAccountsManagement,
  searchAccount,
  resetAdmin
} from "../../store/actions/accountsManagement";
import { createNewAccount } from "../../store/actions/newAccount";
import Wrapper from "../PageWrapper";
import AccountsSection from "./UserAccounts";

class AccountManagement extends Component {
  constructor(props) {
    super(props);
    props.fetchAccountsManagement();
  }

  renderContent() {
    const { user, loadingAccountsMngt, loadingUser } = this.props;

    const isLoading = loadingUser || loadingAccountsMngt;

    if (!user && !isLoading) {
      return <Redirect to="/login" />;
    }

    if (user && !isLoading) {
      return <AccountsSection  />
    }
    return <LoadingSpinner isLoading={isLoading} />;
  }

  render() {
    return (
      <Wrapper title="Admin" subtitle="Accounts Management">
        {this.renderContent()}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loadingUser: state.auth.isLoading,
    loadingAccountsMngt: state.accountsManagement.isLoading,
  };
};

export default connect(
  mapStateToProps,
  { fetchAccountsManagement, createNewAccount, searchAccount, resetAdmin }
)(AccountManagement);
