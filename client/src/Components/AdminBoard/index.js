import "./AdminBoard.css";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import LoadingSpinner from "../LoadingSpinner";
import { fetchAdminBoard } from "../../store/actions/adminBoard";
import Wrapper from "../PageWrapper";
import ErrorReportsSection from "./ErrorReports";
import NotificationsSection from "./Notifications";

class AdminBoard extends Component {
  constructor(props) {
    super(props);
    props.fetchAdminBoard();
  }

  renderAdminBoard() {
    const { user, loadingAdminBoard, loadingUser } = this.props;
    const isLoading = loadingUser || loadingAdminBoard;

    if (!user && !isLoading) {
      return <Redirect to="/login" />;
    }

    if (user && !isLoading) {
      return (
        <React.Fragment>
          <NotificationsSection />

          <div className="line" />
          <ErrorReportsSection />
        </React.Fragment>
      );
    }
    return <LoadingSpinner isLoading={isLoading} />;
  }

  render() {
    return (
      <Wrapper title="Admin" subtitle="Admin Board">
        {this.renderAdminBoard()}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loadingUser: state.auth.isLoading,
    loadingAdminBoard: state.adminBoard.isLoading
  };
};

export default connect(
  mapStateToProps,
  { fetchAdminBoard }
)(AdminBoard);
