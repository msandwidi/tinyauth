import "./Footer.css";
import React, { Component } from "react";
import { connect } from "react-redux";

class Footer extends Component {
  renderFooter() {
    let status = "Not Connected";
    const { user } = this.props;
    if (user) {
      status = "Connected";
    }
    return (
      <footer className="footer">
        <div className="container">
          <span className="text-muted">Status: {status}</span>
        </div>
      </footer>
    );
  }

  render() {
    return this.renderFooter();
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(Footer);
