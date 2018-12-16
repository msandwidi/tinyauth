import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Wrapper from "../PageWrapper";

class Home extends Component {
  renderHomeContent() {
    const { user, loadingUser } = this.props

    if (user && !loadingUser) {
      return <Redirect to="/dashboard" />;
    }
    return <div>Home</div>;

  }

  render() {
    return (
      <Wrapper title="Home">
        {this.renderHomeContent()}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loadingUser: state.auth.isLoading,
  };
};

export default connect(mapStateToProps)(Home);
