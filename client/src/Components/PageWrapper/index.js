import React, { Component } from "react";
import { Helmet } from "react-helmet";
import "react-loading-bar/dist/index.css";
import { connect } from "react-redux";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Header from "../Header";

class Wrapper extends Component {
  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    const { showHeader, title, subtitle } = this.props;
     
    return (
      <React.Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Navbar />
        <main className="container">
          <Header show={showHeader} title={title} subtitle={subtitle} />
          {this.props.children}
        </main>
        <Footer show={true} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    loadingUser: state.auth.isLoading,
    loadingDashboard: state.dashboard.isLoading,
    loadingRecovery: state.accountRecovery.isLoading,
    loadingActivation: state.accountActivation.isLoading,
    loadingUpdate: state.myProfileUpdate.isLoading,
    loadingAccountsMngt: state.accountsManagement.isLoading,
    loadingNewAccount: state.newAccount.isLoading
  };
};

export default connect(mapStateToProps)(Wrapper);
